// src/app/pages/dashboard/dashboard.component.ts

import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { ProductService }  from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SaleService }     from '../../services/sale.service';
import { AuthService }     from '../../services/auth.service';
import { RequestService }  from '../../services/request.service';
import { MatSnackBar }     from '@angular/material/snack-bar';

import { Product }       from '../../models/product.model';
import { Category }      from '../../models/category.model';
import { Sale }          from '../../models/sale.model';
import { ActionRequest } from '../../models/request.model';

Chart.register(...registerables);

// ── Interfaces locales ────────────────────────────────────────────────────────

interface StockMovement {
  id: string;
  delta: number;
  reason: string;
  note?: string | null;
  performedBy?: string | null;
  createdAt?: string | null;
}

// ── Composant ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // Références canvas ADMIN
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;

  // Référence canvas STAFF
  @ViewChild('staffSalesChart') staffSalesChartRef!: ElementRef<HTMLCanvasElement>;

  // ── Données brutes ──────────────────────────────────────────────────────────
  products:   Product[]       = [];
  categories: Category[]      = [];
  sales:      Sale[]          = [];
  requests:   ActionRequest[] = [];

  // ── Statistiques ADMIN ──────────────────────────────────────────────────────
  totalProducts:   number = 0;
  totalCategories: number = 0;
  totalSales:      number = 0;
  totalRevenue:    number = 0;
  avgPrice:        number = 0;
  topProduct:      string = '-';

  // ── Rôles ───────────────────────────────────────────────────────────────────
  isAdmin = false;
  isStaff = false;

  // ── Monitoring (ADMIN) ───────────────────────────────────────────────────────
  stockMovements:   StockMovement[] = [];
  lowStockProducts: Product[]       = [];
  monitorProductId: string | null   = null;

  readonly movementColumns = ['createdAt', 'reason', 'delta', 'performedBy', 'note'];

  // ── État de chargement ──────────────────────────────────────────────────────
  isLoading = true;
  hasError  = false;
  errorMsg  = '';

  // ── Charts ADMIN ─────────────────────────────────────────────────────────────
  private pieChart?: Chart;
  private barChart?: Chart;
  private pieLabels: string[] = [];
  private pieData:   number[] = [];
  private barLabels: string[] = [];
  private barData:   number[] = [];

  // ── Chart STAFF ──────────────────────────────────────────────────────────────
  private staffSalesChart?: Chart;
  private staffChartLabels: string[] = [];
  private staffChartData:   number[] = [];

  // Flags de synchronisation view/data
  private viewReady = false;
  private dataReady = false;

  // Compteurs de réponses attendues (3 appels principaux)
  private loadedCount = 0;

  constructor(
    private productService:  ProductService,
    private categoryService: CategoryService,
    private saleService:     SaleService,
    private authService:     AuthService,
    private requestService:  RequestService,
    private snackBar:        MatSnackBar,
    private cdr:             ChangeDetectorRef,
  ) {}

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isStaff = this.authService.isStaff();

    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.dataReady) {
      setTimeout(() => this.renderAllCharts(), 200);
    }
  }

  // ── Chargement des données (séquentiel, sans forkJoin) ───────────────────────

  private loadData(): void {
    this.isLoading   = true;
    this.hasError    = false;
    this.loadedCount = 0;

    // 1. Produits
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = this.extractArray<Product>(res).map(p => ({
          ...p,
          price: Number(p.price ?? 0),
        }));
        this.onChunkLoaded();
      },
      error: (err) => this.handleLoadError(err),
    });

    // 2. Catégories
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = this.extractArray<Category>(res);
        this.onChunkLoaded();
      },
      error: (err) => this.handleLoadError(err),
    });

    // 3. Ventes
    this.saleService.getSales().subscribe({
      next: (res) => {
        this.sales = this.extractArray<Sale>(res).map(s => ({
          ...s,
          total: s.total && s.total > 0
            ? s.total
            : Number(s.unitPrice ?? 0) * Number(s.quantity ?? 0),
        }));
        this.onChunkLoaded();
      },
      error: (err) => this.handleLoadError(err),
    });

    // Chargements secondaires
    this.loadLowStockAlerts();

    if (this.isStaff) {
      this.loadRequests();
    }
  }

  private onChunkLoaded(): void {
    this.loadedCount++;
    if (this.loadedCount < 3) return;

    this.computeStats();
    this.syncDefaultMonitor();

    if (this.isAdmin) {
      this.buildAdminChartData();
    }

    if (this.isStaff) {
      this.buildStaffChartData();
    }

    this.isLoading = false;
    this.dataReady = true;
    this.cdr.detectChanges();

    if (this.viewReady) {
      setTimeout(() => this.renderAllCharts(), 200);
    }
  }

  private handleLoadError(err: any): void {
    this.isLoading = false;
    this.hasError  = true;
    this.errorMsg  = err.status === 0
      ? 'Backend offline — démarrer NestJS sur le port 8080.'
      : `Erreur ${err.status}: ${err.message}`;
    console.error('Dashboard error:', err);
  }

  // ── Calcul des statistiques (map / filter / reduce uniquement) ───────────────

  private computeStats(): void {
    const { products, categories, sales } = this;

    const prices: number[] = products.map((p: Product) => Number(p.price ?? 0));
    const priceSum: number = prices.reduce(
      (acc: number, price: number) => acc + price, 0,
    );

    this.totalRevenue = sales.reduce(
      (acc: number, s: Sale) => acc + (s.total ?? 0), 0,
    );

    this.totalProducts   = products.length;
    this.totalCategories = categories.length;
    this.totalSales      = sales.length;
    this.avgPrice        = products.length > 0
      ? Math.round(priceSum / products.length)
      : 0;

    if (products.length > 0) {
      const sorted = [...products].sort(
        (a: Product, b: Product) => b.price - a.price,
      );
      this.topProduct = sorted[0].name;
    }
  }

  // ── Données graphiques ADMIN ──────────────────────────────────────────────────

  private buildAdminChartData(): void {
    // Pie: produits par catégorie
    const usedCategories = this.categories.filter((c: Category) =>
      this.products.some((p: Product) => this.sameId(p.categoryId, c.id)),
    );
    this.pieLabels = usedCategories.map((c: Category) => c.name);
    this.pieData   = usedCategories.map(
      (c: Category) =>
        this.products.filter((p: Product) => this.sameId(p.categoryId, c.id)).length,
    );

    // Bar: CA par produit
    const productsWithSales = this.products.filter((p: Product) =>
      this.sales.some((s: Sale) => this.sameId(s.productId, p.id)),
    );
    this.barLabels = productsWithSales.map((p: Product) => p.name);
    this.barData   = productsWithSales.map((p: Product) =>
      this.sales
        .filter((s: Sale) => this.sameId(s.productId, p.id))
        .reduce((acc: number, s: Sale) => acc + (s.total ?? 0), 0),
    );
  }

  // ── Données graphiques STAFF ──────────────────────────────────────────────────
  // Bar chart: quantité vendue par produit (pas de données financières)

  private buildStaffChartData(): void {
    const productsWithSales = this.products.filter((p: Product) =>
      this.sales.some((s: Sale) => this.sameId(s.productId, p.id)),
    );

    this.staffChartLabels = productsWithSales.map((p: Product) => p.name);
    this.staffChartData   = productsWithSales.map((p: Product) =>
      this.sales
        .filter((s: Sale) => this.sameId(s.productId, p.id))
        .reduce((acc: number, s: Sale) => acc + (s.quantity ?? 0), 0),
    );
  }

  // ── Synchronisation sélection par défaut ─────────────────────────────────────

  private syncDefaultMonitor(): void {
    if (this.products.length === 0) return;
    if (this.isAdmin && !this.monitorProductId) {
      this.monitorProductId = this.products[0].id;
      this.loadStockMovements();
    }
  }

  // ── Chargements secondaires ───────────────────────────────────────────────────

  loadLowStockAlerts(): void {
    this.productService.getLowStockAlerts().subscribe({
      next: (data) => { this.lowStockProducts = data ?? []; },
      error: (err: Error) => {
        this.lowStockProducts = [];
        this.snackBar.open(err.message, 'Close', { duration: 4000 });
      },
    });
  }

  private loadRequests(): void {
    this.requestService.getRequests(0, 20).subscribe({
      next: (res) => {
        this.requests = res.content ?? [];
      },
      error: (err: Error) => {
        this.requests = [];
        this.snackBar.open(err.message, 'Close', { duration: 4000 });
      },
    });
  }

  loadStockMovements(): void {
    if (!this.monitorProductId) {
      this.stockMovements = [];
      return;
    }
    this.productService.getStockMovements(this.monitorProductId, 0, 20).subscribe({
      next: (data) => {
        this.stockMovements = Array.isArray(data?.content)
          ? (data.content as StockMovement[])
          : [];
      },
      error: (err: Error) => {
        this.stockMovements = [];
        this.snackBar.open(err.message, 'Close', { duration: 4000 });
      },
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────

  getCategoryName(categoryId: string): string {
    const found = this.categories.find(
      (c: Category) => this.sameId(c.id, categoryId),
    );
    return found ? found.name : '—';
  }

  getProductName(productId: string): string {
    const found = this.products.find(
      (p: Product) => this.sameId(p.id, productId),
    );
    return found ? found.name : '—';
  }

  private sameId(a: any, b: any): boolean {
    return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
  }

  private extractArray<T>(response: any): T[] {
    if (response?.content && Array.isArray(response.content)) {
      return response.content as T[];
    }
    if (Array.isArray(response)) {
      return response as T[];
    }
    return [];
  }

  // ── Rendu des graphiques ──────────────────────────────────────────────────────

  private renderAllCharts(): void {
    if (this.isAdmin) {
      this.renderPieChart();
      this.renderBarChart();
    }
    if (this.isStaff) {
      this.renderStaffSalesChart();
    }
  }

  private renderPieChart(): void {
    const canvas = this.pieChartRef?.nativeElement;
    if (!canvas) return;
    if (this.pieChart) this.pieChart.destroy();

    this.pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: this.pieLabels.length ? this.pieLabels : ['No data'],
        datasets: [{
          data:            this.pieData.length ? this.pieData : [1],
          backgroundColor: ['#4f8ef7','#22c55e','#f97316','#a855f7','#ef4444','#06b6d4','#eab308','#ec4899'],
          borderColor:     '#ffffff',
          borderWidth:     3,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 12 }, padding: 16, color: '#374151' },
          },
        },
      },
    });
  }

  private renderBarChart(): void {
    const canvas = this.barChartRef?.nativeElement;
    if (!canvas) return;
    if (this.barChart) this.barChart.destroy();

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.barLabels.length ? this.barLabels : ['No data'],
        datasets: [{
          label:           'Total Sales ($)',
          data:            this.barData.length ? this.barData : [0],
          backgroundColor: 'rgba(79,142,247,0.85)',
          borderColor:     '#3b6fd4',
          borderWidth:     2,
          borderRadius:    8,
          borderSkipped:   false,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid:  { display: false },
            ticks: { maxRotation: 45, color: '#374151' },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color:    '#374151',
              callback: (value: any) => '$' + value,
            },
          },
        },
      },
    });
  }

  private renderStaffSalesChart(): void {
    const canvas = this.staffSalesChartRef?.nativeElement;
    if (!canvas) return;
    if (this.staffSalesChart) this.staffSalesChart.destroy();

    this.staffSalesChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.staffChartLabels.length ? this.staffChartLabels : ['No data'],
        datasets: [{
          label:           'Qty Sold',
          data:            this.staffChartData.length ? this.staffChartData : [0],
          backgroundColor: 'rgba(34,197,94,0.80)',
          borderColor:     '#16a34a',
          borderWidth:     2,
          borderRadius:    8,
          borderSkipped:   false,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) => ` ${ctx.parsed.y} units sold`,
            },
          },
        },
        scales: {
          x: {
            grid:  { display: false },
            ticks: { maxRotation: 45, color: '#374151' },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#374151', stepSize: 1 },
          },
        },
      },
    });
  }
}
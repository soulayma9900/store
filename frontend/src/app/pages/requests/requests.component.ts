import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SupplierService } from '../../services/supplier.service';
import { ActionRequest, RequestStatus, RequestType } from '../../models/request.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  isAdmin = false;
  isStaff = false;

  // ── Staff form ──────────────────────────────────────────
  restockForm!: FormGroup;

  // ── Data ────────────────────────────────────────────────
  requests: ActionRequest[] = [];
  products: Product[] = [];

  // ── State ───────────────────────────────────────────────
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;

  // ── Filters ─────────────────────────────────────────────
  statusFilter: RequestStatus | '' = '';

  // ── Table columns ───────────────────────────────────────
  readonly adminColumns: string[] = ['product', 'quantity', 'status', 'createdBy', 'createdAt', 'actions'];
  readonly staffColumns: string[] = ['product', 'quantity', 'status', 'createdAt'];

  get displayedColumns(): string[] {
    return this.isAdmin ? this.adminColumns : this.staffColumns;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalElements / this.pageSize));
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private requestService: RequestService,
    private productService: ProductService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isStaff = this.authService.isStaff();

    if (this.isStaff) {
      this.initRestockForm();
      this.loadProducts();
    }

    this.loadRequests();
  }

  // ── Form ────────────────────────────────────────────────

  private initRestockForm(): void {
    this.restockForm = this.fb.group({
      productId: ['', Validators.required],
      quantity:  [1, [Validators.required, Validators.min(0.001)]],
      note:      [''],
    });
  }

  // ── Data loading ─────────────────────────────────────────

  private loadProducts(): void {
    this.productService.getProducts(0, 200).subscribe({
      next: (res) => { this.products = res.content ?? []; },
      error: (err: Error) => this.snackBar.open(err.message, 'Close', { duration: 4000 }),
    });
  }

  loadRequests(): void {
    this.loading = true;
    const filters = {
      status: this.statusFilter || undefined,
      type: 'RESTOCK_REQUEST' as RequestType,
    };

    this.requestService.getRequests(this.currentPage - 1, this.pageSize, filters).subscribe({
      next: ({ content, totalElements }) => {
        this.requests = content;
        this.totalElements = totalElements;
        this.loading = false;
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(err.message, 'Close', { duration: 4000 });
      },
    });
  }

  // ── Staff: submit restock ────────────────────────────────

  submitRestock(): void {
    if (this.restockForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const { productId, quantity, note } = this.restockForm.value;
    const payload: any = {
      productId,
      quantity: Number(quantity),
      draft: false,
    };
    if ((note ?? '').trim()) payload.note = note.trim();

    this.requestService.createRestockRequest(payload).subscribe({
      next: () => {
        this.snackBar.open('Restock request submitted.', 'Close', { duration: 3000 });
        this.restockForm.reset({ productId: '', quantity: 1, note: '' });
        this.loadRequests();
      },
      error: (err: Error) => this.snackBar.open(err.message, 'Close', { duration: 4000 }),
    });
  }

  // ── Admin: approve / reject ──────────────────────────────

  approve(request: ActionRequest): void {
    const reviewNote = prompt('Approval note (optional)');
    this.requestService.approveRequest(request.id, reviewNote ?? null).subscribe({
      next: () => {
        this.snackBar.open('Request approved.', 'Close', { duration: 3000 });
        this.loadRequests();
      },
      error: (err: Error) => this.snackBar.open(err.message, 'Close', { duration: 4000 }),
    });
  }

  reject(request: ActionRequest): void {
    const reviewNote = prompt('Rejection reason (optional)');
    this.requestService.rejectRequest(request.id, reviewNote ?? null).subscribe({
      next: () => {
        this.snackBar.open('Request rejected.', 'Close', { duration: 3000 });
        this.loadRequests();
      },
      error: (err: Error) => this.snackBar.open(err.message, 'Close', { duration: 4000 }),
    });
  }

  // ── Filters / Pagination ─────────────────────────────────

  applyFilters(): void {
    this.currentPage = 1;
    this.loadRequests();
  }

  resetFilters(): void {
    this.statusFilter = '';
    this.currentPage = 1;
    this.loadRequests();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadRequests();
  }

  // ── Helpers ──────────────────────────────────────────────

  getProductName(id?: string | null): string {
    if (!id) return '-';
    return this.products.find(p => p.id === id)?.name ?? '-';
  }

  getQuantity(request: ActionRequest): number | string {
    return request.payload?.['quantity'] ?? '-';
  }
}
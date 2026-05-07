"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaleThreshold = exports.scaleQuantity = exports.scalePrice = void 0;
const scalePrice = (value) => {
    if (value === null || value === undefined) {
        return null;
    }
    return Number(value.toFixed(2));
};
exports.scalePrice = scalePrice;
const scaleQuantity = (value) => {
    if (value === null || value === undefined) {
        return null;
    }
    return Number(value.toFixed(3));
};
exports.scaleQuantity = scaleQuantity;
const scaleThreshold = (value) => {
    if (value === null || value === undefined) {
        return null;
    }
    return Number(value.toFixed(3));
};
exports.scaleThreshold = scaleThreshold;
//# sourceMappingURL=number-utils.js.map
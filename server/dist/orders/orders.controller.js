"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const checkout_dto_1 = require("./dto/checkout.dto");
const confirm_order_dto_1 = require("./dto/confirm-order.dto");
const apply_coupon_dto_1 = require("./dto/apply-coupon.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async checkout(req, checkoutDto) {
        return this.ordersService.checkout(req.user.id, checkoutDto);
    }
    async applyCoupon(req, applyCouponDto) {
        return this.ordersService.applyCoupon(req.user.id, applyCouponDto);
    }
    async confirm(req, confirmDto) {
        return this.ordersService.confirmOrder(req.user.id, confirmDto);
    }
    async getHistory(req) {
        return this.ordersService.getHistory(req.user.id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_dto_1.CheckoutDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "checkout", null);
__decorate([
    (0, common_1.Post)('apply-coupon'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, apply_coupon_dto_1.ApplyCouponDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "applyCoupon", null);
__decorate([
    (0, common_1.Post)('confirm'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, confirm_order_dto_1.ConfirmOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "confirm", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getHistory", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map
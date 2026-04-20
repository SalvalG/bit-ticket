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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const ticket_entity_1 = require("../../tickets/entities/ticket.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDIENTE_PAGO"] = "PENDIENTE_PAGO";
    OrderStatus["COMPLETADA"] = "COMPLETADA";
    OrderStatus["CANCELADA"] = "CANCELADA";
    OrderStatus["REEMBOLSADA"] = "REEMBOLSADA";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Order.prototype, "usuario_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Order.prototype, "fecha_compra", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "monto_total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDIENTE_PAGO,
    }),
    __metadata("design:type", String)
], Order.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "cupon_aplicado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "descuento_pct", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ordenes),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_1.Ticket, (ticket) => ticket.compra),
    __metadata("design:type", Array)
], Order.prototype, "boletos", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => payment_entity_1.Payment, (payment) => payment.orden),
    __metadata("design:type", payment_entity_1.Payment)
], Order.prototype, "pago", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map
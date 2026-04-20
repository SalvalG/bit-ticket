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
exports.Payment = exports.PaymentStatus = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../../orders/entities/order.entity");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["EXITOSO"] = "EXITOSO";
    PaymentStatus["RECHAZADO"] = "RECHAZADO";
    PaymentStatus["REEMBOLSADO"] = "REEMBOLSADO";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Payment = class Payment {
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Payment.prototype, "orden_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "transaccion_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Payment.prototype, "metodo_pago", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.EXITOSO,
    }),
    __metadata("design:type", String)
], Payment.prototype, "estado_pago", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => order_entity_1.Order, (order) => order.pago),
    (0, typeorm_1.JoinColumn)({ name: 'orden_id' }),
    __metadata("design:type", order_entity_1.Order)
], Payment.prototype, "orden", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)('payments')
], Payment);
//# sourceMappingURL=payment.entity.js.map
export declare class TicketSelectionDto {
    zona_id: string;
    cantidad: number;
}
export declare class CheckoutDto {
    evento_id: string;
    boletos: TicketSelectionDto[];
}

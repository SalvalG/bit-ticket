# Especificaciones Funcionales

**Propósito:** Detalle de las capacidades del sistema basadas en los Casos de Uso.

## Gestión de Acceso
- Roles definidos: **Administrador, Staff/Validador y Usuario Cliente**.
- Registro de usuarios con validación de email único.
- Inicio de sesión seguro con JWT.
- Bloqueo de acceso tras 3 intentos fallidos (prevención de fuerza bruta).

## Proceso de Venta
- Consulta de catálogo con filtros dinámicos (fecha, artista, lugar).
- Reserva temporal concurrente de boletos durante 10 minutos en el checkout.
- Integración con pasarelas de pago (Stripe, PayPal) garantizando seguridad.
- Aplicación y validación en tiempo real de cupones o descuentos.

## Post-Venta y Control de Acceso
- Generación automática de códigos QR cifrados y únicos.
- Envío de comprobantes y boletos PDF por correo electrónico de manera asíncrona.
- Historial de compras en el perfil del usuario para descarga posterior de boletos.
- **Validación en Puerta:** Sistema de escaneo en tiempo real (App/Web para el Staff) que marca el boleto como "Usado" para evitar accesos duplicados.

## Gestión Administrativa y Resolución
- Creación, modificación y actualización de eventos.
- **Política de Reembolsos:** Prohibición de eliminar eventos con ventas activas. Si un evento es cancelado por el Administrador, el sistema procesa **automáticamente el reembolso masivo** a través de la pasarela de pagos original.
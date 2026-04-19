# Endpoints de la API (REST API)

**Propósito:** Definición de la interfaz de comunicación entre el Frontend (React) y el Backend (NestJS).

## 1. Módulo de Autenticación (`/auth`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Público | Registro de nuevos usuarios (clientes). Valida que el email sea único. |
| `POST` | `/auth/login` | Público | Autenticación de usuarios y obtención del token JWT. |

## 2. Módulo de Eventos (`/events`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/events` | Público | Lista de eventos disponibles con filtros dinámicos (fecha, artista, lugar). |
| `GET` | `/events/:id` | Público | Detalles completos de un evento específico y disponibilidad de zonas. |
| `POST` | `/events` | Administrador | Creación de un nuevo evento. |
| `PUT` | `/events/:id` | Administrador | Modificación de la información de un evento existente (sin afectar aforo vendido). |
| `POST` | `/events/:id/cancel` | Administrador | Cancela el evento y dispara el proceso masivo de **reembolsos automáticos** (UC9). |

## 3. Módulo de Órdenes y Compras (`/orders`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders/checkout` | Usuario | Inicia el proceso de compra y reserva temporalmente los boletos (por 10 minutos). |
| `POST` | `/orders/apply-coupon`| Usuario | Valida y aplica un código de descuento al subtotal de la compra (UC8). |
| `POST` | `/orders/confirm` | Usuario / Webhook | Procesa la confirmación de la pasarela de pago (Stripe/PayPal) y consolida la venta. |
| `GET` | `/orders/history` | Usuario | Consulta el historial de compras y transacciones del usuario autenticado (UC7). |

## 4. Módulo de Boletos (`/tickets`)
| Método | Endpoint | Rol Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/tickets/:id/download` | Usuario | Genera y descarga el boleto digital en PDF con su código QR único (UC4). |
| `POST` | `/tickets/validate` | Staff / Validador| Escanea y valida un UUID/QR en la puerta, marcando el boleto como "Usado" (UC10). |
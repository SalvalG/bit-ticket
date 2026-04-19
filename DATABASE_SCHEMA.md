# Esquema de Base de Datos (Database Schema)

**Propósito:** Definir la estructura de persistencia basada en el Modelo de Dominio, adaptada para soportar reservas temporales, concurrencia, pagos y múltiples roles.

## Entidades Principales

### 1. Usuarios (`users`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `nombre` | VARCHAR | Nombre completo del usuario. |
| `email` | VARCHAR | Correo electrónico (Único). |
| `password_hash` | VARCHAR | Contraseña encriptada (`bcrypt`). |
| `rol` | ENUM | `ADMIN`, `STAFF`, `CLIENTE`. |
| `created_at` | TIMESTAMP | Fecha de registro en el sistema. |

### 2. Eventos (`events`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `nombre` | VARCHAR | Título del concierto/evento. |
| `descripcion` | TEXT | Información detallada del evento. |
| `fecha` | TIMESTAMP | Fecha y hora de realización. |
| `ubicacion` | VARCHAR | Lugar (ej. Plaza de Toros, Auditorio). |
| `estado` | ENUM | `ACTIVO`, `CANCELADO`, `FINALIZADO`. |

### 3. Zonas (`zones`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `evento_id` | UUID | Relación con el Evento (FK). |
| `nombre` | VARCHAR | Ej. VIP, General, Ruedo, Gradas. |
| `precio` | DECIMAL | Costo monetario por boleto en esta zona. |
| `capacidad_total` | INT | Número máximo de asientos/personas. |
| `asientos_disponibles`| INT | Asientos libres actualmente (se actualiza). |

### 4. Boletos (`tickets`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `zona_id` | UUID | Relación con la Zona específica (FK). |
| `compra_id` | UUID | Relación con la Orden de Compra (FK, *Nullable*). |
| `uuid_secreto` | UUID | Hash/UUID único y secreto para generar el QR. |
| `estado` | ENUM | `DISPONIBLE`, `RESERVADO`, `VENDIDO`, `USADO`. |

### 5. Órdenes / Compras (`orders`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `usuario_id` | UUID | El usuario que realizó la compra (FK). |
| `fecha_compra` | TIMESTAMP | Fecha de la transacción. |
| `monto_total` | DECIMAL | Costo final tras descuentos o impuestos. |
| `estado` | ENUM | `PENDIENTE_PAGO`, `COMPLETADA`, `CANCELADA`, `REEMBOLSADA`. |

### 6. Pagos (`payments`)
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `orden_id` | UUID | Relación 1:1 con la Compra (FK). |
| `transaccion_id`| VARCHAR | ID provisto por la pasarela (ej. `ch_1M2b...`). |
| `metodo_pago` | VARCHAR | Tarjeta, PayPal, etc. |
| `estado_pago` | ENUM | `EXITOSO`, `RECHAZADO`, `REEMBOLSADO`. |

### 7. Cupones (`coupons`) *(Nuevo)*
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único (PK). |
| `codigo` | VARCHAR | Código escrito por el usuario (ej. `VERANO20`). |
| `descuento_pct` | DECIMAL | Porcentaje a descontar del subtotal. |
| `limite_usos` | INT | Cuántas veces puede usarse a nivel global. |
| `usos_actuales` | INT | Veces que ya ha sido canjeado. |
| `valido_hasta` | TIMESTAMP | Fecha de expiración de la promoción. |
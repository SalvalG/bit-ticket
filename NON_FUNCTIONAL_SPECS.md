# Especificaciones No Funcionales (Non-Functional Requirements)

**Propósito:** Definir los atributos de calidad, restricciones técnicas y requerimientos de infraestructura necesarios para garantizar una operación óptima y segura del sistema.

## 1. Rendimiento y Escalabilidad (Performance)
- **Tiempo de Respuesta:** El tiempo de respuesta promedio de las peticiones a la API (especialmente en catálogo y validación en puerta) debe ser menor a 300 ms. El tiempo máximo absoluto permitido es de 3 segundos bajo estrés extremo.
- **Reserva Concurrente de Boletos:** El sistema debe manejar múltiples solicitudes simultáneas para el mismo evento o zona sin permitir sobreventa (*Race conditions*), bloqueando temporalmente los registros a nivel de base de datos.
- **Picos de Tráfico (Alta Demanda):** La arquitectura (basada en Docker/Nginx/NestJS) debe estar preparada para soportar la alta concurrencia de usuarios generada durante el inicio de ventas de eventos muy populares.

## 2. Seguridad (Security)
- **Cifrado de Comunicaciones:** Todo el tráfico entre la aplicación (cliente) y la API (servidor) debe realizarse estrictamente mediante HTTPS (TLS 1.2 o superior).
- **Almacenamiento de Credenciales:** Las contraseñas de los usuarios no se guardarán en texto plano; deben usar hashing criptográfico (como `bcrypt` o `Argon2`).
- **Autenticación y Autorización:** Las sesiones se manejarán mediante JSON Web Tokens (JWT) firmados, con un estricto control de acceso basado en roles (RBAC): Administrador, Staff/Validador y Usuario Cliente.
- **Integridad de Pagos (PCI DSS):** El sistema **no almacenará** bajo ninguna circunstancia números de tarjeta de crédito. Todo el procesamiento se delegará a pasarelas certificadas (Stripe/PayPal).
- **Prevención de Fraude:** Los códigos QR de los boletos digitales deben contener identificadores ofuscados y firmas digitales que hagan matemáticamente imposible su falsificación o adivinación.

## 3. Fiabilidad y Disponibilidad (Reliability)
- **Liberación de Reservas:** El bloqueo de boletos en la etapa de pago tiene un tiempo de vida estricto (ej. 10 minutos). Un proceso en segundo plano (cronjob/tarea programada) liberará automáticamente el inventario si el pago no se completa.
- **Tolerancia a Fallos y Reintentos:** Los procesos asíncronos (envío de correos de boletos PDF, reembolsos automáticos) deben implementarse con colas que intenten procesar de nuevo la tarea si el proveedor de correo o pago sufre una caída temporal.
- **Recuperación:** Los servicios en Docker deben tener políticas de reinicio automático (`restart: always`) para recuperarse de inmediato ante caídas inesperadas del proceso de Node.js.

## 4. Usabilidad (Usability)
- **Diseño Mobile-First:** Dado que más del 80% del tráfico vendrá de celulares, la interfaz debe ser completamente responsiva, priorizando la experiencia táctil (botones grandes, flujos de pago sencillos).
- **Interfaz del Validador:** La aplicación web/móvil usada por el Staff para escanear en puerta debe tener un diseño de alto contraste (funcional de noche), escaneo rápido con cámara y respuestas visuales evidentes (Pantalla Verde enorme para acceso, Pantalla Roja para fraude/ya usado).

## 5. Mantenibilidad
- **Arquitectura Modular:** El backend en NestJS mantendrá una separación estricta de responsabilidades (Controladores, Servicios, Repositorios) facilitando futuras actualizaciones y pruebas.
- **Trazabilidad (Logs):** Las operaciones críticas (pagos exitosos, pagos rechazados, cancelaciones de eventos y reembolsos) quedarán guardadas en registros del sistema detallados para futuras auditorías o depuración.
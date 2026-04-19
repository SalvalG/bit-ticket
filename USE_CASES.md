# Casos de Uso (Use Cases)

## Resumen de Casos de Uso
1. **UC1:** Registro de Usuario
2. **UC2:** Inicio y Cierre de Sesión
3. **UC3:** Comprar Boletos (Seleccionar boletos y Realizar Pago)
4. **UC4:** Generar y Enviar Boleto Digital
5. **UC5:** Visualización de Conciertos Disponibles
6. **UC6:** Gestión de Eventos por el Administrador
7. **UC7:** Historial de Compras
8. **UC8:** Aplicación de Cupones o Descuentos
9. **UC9:** Cancelación de Evento y Reembolso Automático *(Nuevo)*
10. **UC10:** Validación de Boleto en Puerta *(Nuevo)*

---

## Detalle de Casos de Uso

### UC1: Registro de Usuario
**Descripción:** Un usuario accede al sistema con la intención de crear una cuenta. Selecciona la opción de registro y el sistema le muestra un formulario donde introduce su nombre, correo electrónico y contraseña. El sistema valida que el correo no haya sido registrado previamente y que los datos cumplan con los requisitos de seguridad. Si la información es correcta, el sistema crea la cuenta y deja al usuario listo para iniciar sesión. En caso de que el correo ya exista o falten datos, el sistema muestra un mensaje indicando el problema y solicita la corrección.

- **Actor principal:** Usuario (Visitante).
- **Personal involucrado e intereses:**
  - *Usuario:* Desea crear una cuenta rápida y segura para poder comprar boletos.
  - *Sistema:* Requiere validar la unicidad del correo electrónico y la fortaleza de la contraseña.
- **Precondiciones:** El visitante no debe tener una sesión activa.
- **Garantías de éxito (Postcondiciones):**
  - La cuenta de usuario es creada y guardada en la base de datos.
  - El usuario queda listo para iniciar sesión (o se autologuea).
- **Escenario principal de éxito:**
  1. El Usuario selecciona la opción de "Registro".
  2. El Sistema muestra el formulario de registro.
  3. El Usuario introduce su nombre, correo electrónico y contraseña.
  4. El Sistema valida que el correo no esté registrado y que la contraseña cumpla los estándares.
  5. El Sistema crea la cuenta del usuario.
  6. El Sistema notifica éxito y redirige al inicio de sesión.
- **Extensiones:**
  - **4a. Correo ya registrado:** El Sistema advierte que el correo existe, indicando el problema y sugiere recuperar la contraseña o iniciar sesión.
  - **4b. Datos inválidos o incompletos:** El Sistema muestra un mensaje indicando el problema, resalta los campos con error y solicita la corrección.
- **Frecuencia:** Una vez por usuario.

### UC2: Inicio y Cierre de Sesión
**Descripción:** Un usuario registrado accede al sistema ingresando su correo electrónico y contraseña en la pantalla de inicio de sesión. El sistema verifica las credenciales y, si son correctas, permite el acceso y muestra la página principal. Durante su navegación, el usuario puede cerrar sesión seleccionando la opción correspondiente. El sistema finaliza la sesión de forma segura y redirige al usuario a la pantalla inicial. Si las credenciales son incorrectas, el sistema muestra un mensaje de error y, tras varios intentos fallidos, bloquea temporalmente el acceso.

- **Actor principal:** Usuario Registrado / Administrador / Staff.
- **Precondiciones:** El usuario debe estar previamente registrado en el sistema.
- **Garantías de éxito (Postcondiciones):**
  - Se genera un token de sesión (JWT) válido para el usuario.
  - Al cerrar, el token es invalidado/eliminado del cliente y el usuario es redirigido.
- **Escenario principal de éxito (Inicio y Cierre):**
  1. El Usuario ingresa a la pantalla de login.
  2. El Usuario introduce su correo y contraseña.
  3. El Sistema verifica las credenciales contra la base de datos.
  4. El Sistema concede el acceso, genera el token y muestra la página principal o dashboard (según el rol).
  5. Durante la navegación, el Usuario selecciona la opción "Cerrar sesión".
  6. El Sistema finaliza la sesión de forma segura (invalida el token) y redirige al Usuario a la pantalla inicial.
- **Extensiones:**
  - **3a. Credenciales incorrectas:** El Sistema muestra un mensaje de error genérico ("Correo o contraseña inválidos").
  - **3b. Límite de intentos excedido:** Tras varios intentos fallidos (ej. 3 intentos), el Sistema bloquea la cuenta temporalmente (ej. 15 minutos) e informa al usuario.
- **Frecuencia:** Alta.

### UC3: Comprar Boletos
**Descripción:** 
*Seleccionar boletos:* Después de elegir un concierto, el usuario selecciona la opción de compra de boletos. El sistema muestra las zonas disponibles y permite indicar la cantidad deseada. Al confirmar la selección, el sistema valida la disponibilidad y reserva los boletos de manera temporal, mostrando un resumen con el total a pagar. Si alguna zona no está disponible o la reserva expira, el sistema notifica al usuario y libera los boletos.
*Realizar Pago:* Con los boletos seleccionados, el usuario procede al pago. El sistema muestra los métodos disponibles y el usuario ingresa la información requerida según el método elegido. El sistema envía los datos a la pasarela de pago y espera la confirmación. Si el pago es aprobado, la compra queda registrada como completada. En caso de rechazo o cancelación, el sistema informa el motivo y anula la reserva temporal si corresponde.

- **Actor principal:** Usuario.
- **Personal involucrado e intereses:**
  - *Usuario:* quiere comprar boletos disponibles y pagar de forma segura.
  - *Sistema:* quiere validar disponibilidad y registrar la compra correctamente.
  - *Negocio:* quiere registrar ventas, aplicar precios y promociones correctamente.
  - *Pasarela de Pago:* quiere recibir solicitudes válidas y seguras.
- **Precondiciones:**
  - El usuario debe haber iniciado sesión.
  - Debe existir al menos un concierto disponible.
- **Garantías de éxito (Postcondiciones):**
  - La compra queda registrada como pagada.
  - Los boletos quedan asignados al usuario.
  - Se actualiza la disponibilidad de boletos.
- **Escenario principal de éxito:**
  1. El Usuario selecciona un concierto.
  2. El Sistema muestra las zonas y precios disponibles.
  3. El Usuario selecciona zona y cantidad de boletos.
  4. El Sistema valida disponibilidad y reserva los boletos temporalmente.
  5. El Sistema muestra el resumen de compra.
  6. El Usuario selecciona un método de pago.
  7. El Usuario ingresa la información requerida.
  8. El Sistema envía la solicitud a la pasarela de pago.
  9. El Sistema recibe la confirmación del pago.
  10. El Sistema registra la compra como completada.
- **Extensiones:**
  - **4a. Zona agotada:** El Sistema notifica al Usuario. El Sistema muestra zonas alternativas.
  - **4b. Reserva expirada:** El Sistema libera los boletos. El Sistema notifica al Usuario.
  - **9a. Pago rechazado:** El Sistema informa el rechazo o cancelación. El Usuario elige otro método de pago o cancela la compra.
- **Requisitos especiales:**
  - Tiempo máximo de reserva temporal.
  - Seguridad en la transmisión de datos de pago.
- **Frecuencia:** Media-alta (en periodos de venta).

### UC4: Generar y Enviar Boleto Digital
**Descripción:** 
*Generar Boleto Digital:* Una vez confirmado el pago, el sistema genera automáticamente un boleto digital. Para ello crea un identificador único y un código QR con los datos del evento y del usuario. El boleto se genera en formato digital y queda asociado a la compra. Si ocurre algún error durante el proceso, el sistema intenta nuevamente y, de persistir el problema, notifica al usuario y al equipo de soporte.
*Envío de Boleto por Correo:* Tras la generación del boleto digital, el sistema envía el boleto al correo electrónico del usuario como archivo adjunto. Se registra la fecha y hora del envío para control interno. Si el envío falla, el sistema realiza varios intentos y, en caso de no lograrlo, marca el envío como pendiente e informa al usuario.

- **Actor principal:** Sistema.
- **Personal involucrado e intereses:**
  - *Usuario:* quiere recibir su boleto digital para acceder al evento.
  - *Sistema:* quiere generar boletos únicos y válidos.
  - *Negocio:* quiere evitar duplicación o fraude.
- **Precondiciones:** El pago debe estar confirmado.
- **Garantías de éxito (Postcondiciones):**
  - El boleto digital queda generado.
  - El boleto se envía al correo del usuario.
  - El boleto queda asociado a la compra.
- **Escenario principal de éxito:**
  1. El Sistema genera un identificador único del boleto.
  2. El Sistema crea el código QR del evento.
  3. El Sistema genera el boleto en formato digital.
  4. El Sistema asocia el boleto a la compra.
  5. El Sistema envía el boleto al correo del Usuario.
  6. El Sistema registra el envío.
- **Extensiones:**
  - **5a. Error en el envío del correo:** El Sistema reintenta el envío automáticamente. Si el error persiste, el envío queda marcado como pendiente y se informa al usuario.
- **Requisitos especiales:**
  - Código QR único y no reutilizable.
  - Soporte para descarga posterior desde el historial.
- **Frecuencia:** Una vez por cada compra exitosa.

### UC5: Visualización de Conciertos Disponibles
**Descripción:** El usuario ingresa a la sección de conciertos para consultar los eventos disponibles. El sistema muestra una lista con información relevante como fecha, lugar, artista y precio. El usuario puede aplicar filtros para facilitar la búsqueda y seleccionar un concierto para ver sus detalles completos. Si no existen conciertos registrados o ocurre un problema de conexión, el sistema informa la situación al usuario.

- **Actor principal:** Usuario (Visitante o Registrado).
- **Precondiciones:** La plataforma está operativa.
- **Garantías de éxito (Postcondiciones):** El usuario visualiza la lista y detalles de los eventos.
- **Escenario principal de éxito:**
  1. El Usuario entra a la sección de cartelera.
  2. El Sistema recupera los conciertos activos de la base de datos.
  3. El Sistema muestra la lista con fechas, imágenes y precios base.
  4. El Usuario aplica un filtro (ej. por fecha o artista).
  5. El Sistema actualiza la lista según el filtro.
  6. El Usuario selecciona un concierto específico y el Sistema muestra todo su detalle (descripción, zonas disponibles).
- **Extensiones:**
  - **2a. Sin conciertos:** El Sistema muestra un mensaje amigable indicando que no hay eventos próximamente registrados.
  - **2b. Problema de conexión:** Si ocurre un error al recuperar los datos, el Sistema informa la situación al usuario invitándolo a recargar la página más tarde.

### UC6: Gestión de Eventos por el Administrador
**Descripción:** Un administrador accede al panel de gestión de eventos para crear, modificar o eliminar conciertos. El sistema valida la información ingresada y actualiza la base de datos según la acción realizada. Si un evento ya tiene boletos vendidos, el sistema impide su eliminación directa y ofrece opciones alternativas como la cancelación del evento y la gestión de reembolsos.

- **Actor principal:** Administrador.
- **Precondiciones:** El Administrador ha iniciado sesión con los permisos adecuados.
- **Garantías de éxito (Postcondiciones):** El evento es creado, modificado o cancelado, y la cartelera se actualiza.
- **Escenario principal de éxito:**
  1. El Administrador entra al panel de gestión y selecciona "Crear Evento".
  2. Introduce los detalles (artista, lugar, fecha, zonas, aforo y precios).
  3. El Sistema valida la integridad de los datos (fechas futuras, precios válidos).
  4. El Sistema guarda el evento y lo publica en la plataforma.
- **Extensiones:**
  - **4a. Modificar evento con boletos vendidos:** El Sistema bloquea cambios estructurales (reducir aforo por debajo de lo vendido, cambiar el lugar de forma incompatible) pero permite actualizar descripciones.
  - **4b. Eliminar evento con boletos vendidos:** El Sistema prohíbe la eliminación directa. Obliga al Administrador a ejecutar el proceso de "Cancelación" para gestionar los reembolsos (ver UC9).

### UC7: Historial de Compras
**Descripción:** El usuario accede a su perfil y consulta el historial de compras realizadas. El sistema muestra una lista de transacciones con sus detalles, permitiendo al usuario revisar información y descargar nuevamente sus boletos digitales. Si no existen compras registradas o ocurre un error, el sistema informa la situación.

- **Actor principal:** Usuario Registrado.
- **Precondiciones:** El usuario ha iniciado sesión.
- **Garantías de éxito (Postcondiciones):** El usuario puede visualizar sus transacciones pasadas y descargar boletos activos.
- **Escenario principal de éxito:**
  1. El Usuario accede a la sección "Mis Compras" en su perfil.
  2. El Sistema consulta la base de datos y despliega el listado de transacciones ordenadas por fecha reciente.
  3. El Usuario selecciona una compra específica.
  4. El Sistema muestra los detalles y un botón para "Descargar Boletos".
  5. El Usuario descarga sus boletos en formato PDF.
- **Extensiones:**
  - **2a. Sin compras registradas:** El Sistema muestra un mensaje informando que aún no existen transacciones en el historial.
  - **2b. Error al consultar:** Si ocurre un error técnico recuperando el historial, el Sistema informa de la situación al usuario temporalmente.

### UC8: Aplicación de Cupones o Descuentos
**Descripción:** Durante el proceso de compra, el usuario puede ingresar un código promocional. El sistema valida que el cupón esté vigente y cumpla con las condiciones establecidas. Si es válido, el descuento se aplica al total y el sistema actualiza el monto a pagar. Si el cupón es inválido, vencido o ha alcanzado su límite de uso, el sistema notifica al usuario y mantiene el precio original.

- **Actor principal:** Usuario Registrado.
- **Precondiciones:** El usuario se encuentra en la etapa de checkout (resumen de compra).
- **Garantías de éxito (Postcondiciones):** El monto total se reduce de acuerdo con la lógica del cupón.
- **Escenario principal de éxito:**
  1. El Usuario introduce un código promocional en la caja de texto y hace clic en "Aplicar".
  2. El Sistema consulta el estado del cupón (vigencia, límite de usos, reglas de negocio).
  3. El Sistema valida positivamente y recalcula el subtotal.
  4. El Sistema actualiza la interfaz mostrando el descuento y el nuevo total.
- **Extensiones:**
  - **2a. Cupón inválido, vencido o sin usos disponibles:** El Sistema notifica al usuario que el código es inválido, ha vencido o alcanzó su límite de uso, y mantiene el precio original.

### UC9: Cancelación de Evento y Reembolso Automático
- **Actor principal:** Administrador y Sistema.
- **Precondiciones:** Existe un evento programado con al menos 1 boleto vendido.
- **Garantías de éxito (Postcondiciones):** El evento cambia a estado "Cancelado", se liberan futuros boletos y se inician las órdenes de reembolso automáticas en la pasarela de pagos.
- **Escenario principal de éxito:**
  1. El Administrador selecciona un evento y marca la opción "Cancelar Evento".
  2. El Sistema solicita confirmación de seguridad e ingreso de un motivo.
  3. El Administrador confirma.
  4. El Sistema cambia el estado del evento a "Cancelado" (ya no se muestra para venta).
  5. El Sistema recupera todas las transacciones exitosas asociadas a ese evento.
  6. El Sistema solicita a la pasarela de pagos (Stripe/PayPal) el reembolso automático hacia las tarjetas originales.
  7. El Sistema envía un correo a todos los compradores notificando la cancelación y el tiempo estimado para ver reflejado su reembolso.

### UC10: Validación de Boleto en Puerta
- **Actor principal:** Staff / Validador.
- **Precondiciones:** El Staff ha iniciado sesión en la app móvil o web de escaneo. El evento está por ocurrir o en curso.
- **Garantías de éxito (Postcondiciones):** El boleto se marca como "Usado" impidiendo futuros ingresos con el mismo QR.
- **Escenario principal de éxito:**
  1. El Staff escanea el código QR del boleto del usuario utilizando la cámara del dispositivo.
  2. El Sistema lee y descifra el UUID.
  3. El Sistema consulta el estado del boleto en la base de datos.
  4. El Sistema valida que el boleto pertenece al evento actual y está en estado "Válido".
  5. El Sistema marca el boleto como "Usado".
  6. El Sistema muestra una pantalla verde de "ACCESO CONCEDIDO" al Staff.
- **Extensiones:**
  - **4a. Boleto ya utilizado:** El Sistema detecta que el estado es "Usado" y muestra una pantalla roja de "ALERTA: BOLETO DUPLICADO/YA INGRESADO".
  - **4b. Boleto de otro evento o falso:** El Sistema muestra una pantalla roja de "BOLETO INVÁLIDO".

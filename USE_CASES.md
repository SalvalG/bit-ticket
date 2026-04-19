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
  - **4a. Correo ya registrado:** El Sistema advierte que el correo existe y sugiere recuperar la contraseña.
  - **4b. Datos inválidos o incompletos:** El Sistema resalta los campos con error y solicita corrección.
- **Frecuencia:** Una vez por usuario.

### UC2: Inicio y Cierre de Sesión
- **Actor principal:** Usuario Registrado / Administrador / Staff.
- **Precondiciones:** El usuario debe estar previamente registrado en el sistema.
- **Garantías de éxito (Postcondiciones):**
  - Se genera un token de sesión (JWT) válido para el usuario.
  - Al cerrar, el token es invalidado/eliminado del cliente.
- **Escenario principal de éxito (Inicio):**
  1. El Usuario ingresa a la pantalla de login.
  2. El Usuario introduce su correo y contraseña.
  3. El Sistema verifica las credenciales contra la base de datos.
  4. El Sistema concede el acceso, genera el token y redirige a la página principal o dashboard (según el rol).
- **Extensiones:**
  - **3a. Credenciales incorrectas:** El Sistema muestra un mensaje de error genérico ("Correo o contraseña inválidos").
  - **3b. Límite de intentos excedido:** Tras 3 intentos fallidos, el Sistema bloquea la cuenta temporalmente por 15 minutos e informa al usuario.
- **Frecuencia:** Alta.

### UC3: Comprar Boletos
- **Actor principal:** Usuario Registrado.
- **Precondiciones:** El usuario ha iniciado sesión. Existe al menos un concierto disponible.
- **Garantías de éxito (Postcondiciones):** La compra es pagada, los boletos se asignan al usuario, y se descuenta el inventario.
- **Escenario principal de éxito:**
  1. El Usuario selecciona un concierto y el Sistema muestra las zonas y precios.
  2. El Usuario selecciona la zona y cantidad de boletos.
  3. El Sistema valida disponibilidad y reserva los boletos temporalmente (ej. por 10 minutos).
  4. El Sistema muestra el resumen con el total.
  5. El Usuario ingresa la información de pago.
  6. El Sistema envía los datos a la pasarela de pago y recibe la confirmación.
  7. El Sistema registra la compra como completada.
- **Extensiones:**
  - **3a. Zona agotada:** El Sistema notifica al Usuario y muestra zonas con disponibilidad.
  - **3b. Reserva expirada:** Pasado el tiempo límite, el Sistema libera los boletos y notifica al usuario.
  - **6a. Pago rechazado:** El Sistema notifica el rechazo, permitiendo intentar con otro método.
- **Requisitos especiales:** Transmisión segura (PCI-DSS) y concurrencia estricta para evitar sobreventa.

### UC4: Generar y Enviar Boleto Digital
- **Actor principal:** Sistema.
- **Precondiciones:** El pago de la compra (UC3) ha sido confirmado.
- **Garantías de éxito (Postcondiciones):** Boleto digital con QR único creado, asociado al usuario y enviado por correo.
- **Escenario principal de éxito:**
  1. El Sistema genera un identificador único (UUID) para cada boleto.
  2. El Sistema crea un código QR cifrado.
  3. El Sistema adjunta el QR a una plantilla en PDF (Boleto Digital).
  4. El Sistema asocia los boletos a la cuenta del usuario.
  5. El Sistema envía el PDF al correo del usuario y registra el envío exitoso.
- **Extensiones:**
  - **5a. Falla de envío:** El Sistema programa reintentos automáticos en segundo plano. Si falla definitivamente, lo marca como "Pendiente" y alerta al soporte.

### UC5: Visualización de Conciertos Disponibles
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
  - **2a. Sin conciertos:** El Sistema muestra un mensaje amigable indicando que no hay eventos próximamente.

### UC6: Gestión de Eventos por el Administrador
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
  - **4b. Eliminar evento con boletos vendidos:** El Sistema prohíbe la eliminación. Obliga al Administrador a ejecutar el proceso de "Cancelación" (ver UC9).

### UC7: Historial de Compras
- **Actor principal:** Usuario Registrado.
- **Precondiciones:** El usuario ha iniciado sesión.
- **Garantías de éxito (Postcondiciones):** El usuario puede visualizar sus transacciones pasadas y descargar boletos activos.
- **Escenario principal de éxito:**
  1. El Usuario accede a la sección "Mis Compras" en su perfil.
  2. El Sistema consulta la base de datos y despliega el listado de transacciones ordenadas por fecha reciente.
  3. El Usuario selecciona una compra específica.
  4. El Sistema muestra los detalles y un botón para "Descargar Boletos".
  5. El Usuario descarga sus boletos en formato PDF.

### UC8: Aplicación de Cupones o Descuentos
- **Actor principal:** Usuario Registrado.
- **Precondiciones:** El usuario se encuentra en la etapa de checkout (resumen de compra).
- **Garantías de éxito (Postcondiciones):** El monto total se reduce de acuerdo con la lógica del cupón.
- **Escenario principal de éxito:**
  1. El Usuario introduce un código promocional en la caja de texto y hace clic en "Aplicar".
  2. El Sistema consulta el estado del cupón (vigencia, límite de usos, reglas de negocio).
  3. El Sistema valida positivamente y recalcula el subtotal.
  4. El Sistema actualiza la interfaz mostrando el descuento y el nuevo total.
- **Extensiones:**
  - **2a. Cupón inválido/expirado:** El Sistema notifica que el código no es válido y mantiene el total original.

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

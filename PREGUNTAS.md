# Respuestas — Repaso Técnico

---

## 1. Diferencia entre GET y POST

**GET** es el método HTTP que indica que se debe recuperar información del servidor (o base de datos), sin modificar nada.
**POST** es el método que indica que se deben enviar datos al servidor para crear un nuevo recurso.

---

## 2. Códigos HTTP para: create, not found, internal server error

| Situación             | Código |
|-----------------------|--------|
| Create                | `201 Created` |
| Not Found             | `404 Not Found` |
| Internal Server Error | `500 Internal Server Error` |

---

## 3. ¿Qué es CORS y cuándo aparece?

CORS es una política de seguridad del navegador que controla qué orígenes externos tienen permitido hacer peticiones a una API o recurso. Aparece cuando el frontend y el backend están en dominios o puertos distintos (por ejemplo, `localhost:3000` intentando consumir `localhost:5000`).

---

## 4. Diferencia entre el modelo CodeFirst y DatabaseFirst

**Code First:** se crean primero las clases, modelos y configuraciones en el código, y a partir de ellas se genera la estructura de la base de datos (mediante migraciones).

**Database First:** la base de datos ya existe previamente, y a partir de ella se genera el código (modelos y contexto) de forma automática.

---

## 5. ¿Qué es una migración en EF Core y cuándo crearías una nueva?

Una migración es un registro de los cambios realizados en los modelos del código, que EF Core traduce a instrucciones SQL para mantener el esquema de la base de datos sincronizado con el código.

Se crea una nueva migración siempre que haya una modificación en la estructura del modelo de datos: agregar una entidad, cambiar una propiedad, agregar una relación, etc.

---

## 6. DTO vs Entidad: ¿por qué no exponer entidades?

Si se expone la entidad directamente, el cliente puede ver toda la información, incluyendo datos sensibles (contraseñas, IDs internos, relaciones de navegación, etc.) y se genera un acoplamiento fuerte entre la API y la base de datos.

El DTO expone únicamente los datos necesarios para cada caso de uso, mejorando la seguridad y el control sobre la información que se comparte.

---

## 7. ¿Qué es inyección de dependencias (DI) y por qué se usa en ASP.NET Core?

La inyección de dependencias es un patrón de diseño en el que una clase recibe las dependencias que necesita desde el exterior, en lugar de crearlas ella misma. Esto facilita el desacoplamiento, la testabilidad y el mantenimiento del código.

Se usa ampliamente en ASP.NET Core: por ejemplo, para consumir un servicio en un controlador, o para inyectar un `DbContext` en un repositorio.

---

## 8. Diferencia entre Props y State en React (caso simple)

Los props son propiedades que se le pasan a un componente desde su padre para configurar su comportamiento o apariencia. Son de solo lectura desde el componente que los recibe.

El state es una variable interna y dinámica del componente que cada vez que cambia, provoca una re-renderización del DOM.

---

## 9. Nombre una buena práctica de commits

Hacer commits pequeños con mensajes claros que describan el cambio, y seguir una convención de nombrado como Conventional Commits (ej: `feat:`, `fix:`, `chore:`).

---

## 10. ¿Qué son los principios SOLID? Da ejemplos de cada uno

Los principios SOLID son 5 principios de diseño orientados a crear software mantenible, escalable y flexible.

### a. Single Responsibility Principle (SRP)
Cada clase debe tener una única razón para cambiar (una sola responsabilidad).

*Ejemplo:* Una clase `UserService` solo maneja lógica de usuarios, no genera reportes. Para eso existiría un `ReportService` separado.

### b. Open/Closed Principle (OCP)
Las clases deben estar abiertas a extensión, pero cerradas a modificación.

*Ejemplo:* Crear una interfaz `IPaymentMethod` y múltiples implementaciones (`CreditCardPayment`, `PayPalPayment`) sin modificar la clase base cada vez que se agrega un nuevo medio de pago.

### c. Liskov Substitution Principle (LSP)
Una clase hija debe poder reemplazar a la clase padre sin romper el comportamiento del sistema.

*Ejemplo:* Si `Bird` tiene un método `Fly()`, una subclase `Penguin` que no puede volar rompe este principio — señal de que la jerarquía está mal diseñada.

### d. Interface Segregation Principle (ISP)
Ninguna clase debería verse obligada a implementar métodos que no usa.

*Ejemplo:* En lugar de una interfaz `IWorker` con métodos `Work()` y `Eat()`, separar en `IWorkable` e `IFeedable` para que los robots implementen solo `IWorkable`.

### e. Dependency Inversion Principle (DIP)
Depender de abstracciones, no de implementaciones concretas.

*Ejemplo:* Un controlador depende de `IUserRepository` (interfaz), no de `SqlUserRepository` directamente. Esto permite cambiar la implementación sin tocar el controlador.

---

## 11. Normalización básica: ¿cuándo evitarías la duplicación de datos?

Se evita la duplicación cuando un dato puede cambiar y está repetido en múltiples registros (por ejemplo, el nombre de una ciudad en cada fila de una tabla de clientes). En ese caso, se normaliza creando una tabla separada y referenciándola con una clave foránea (FK), asegurando consistencia e integridad.

---


## 12. ¿Qué es una FK y por qué es importante?

Una Foreign Key es un campo en una tabla que referencia la Primary Key (clave primaria) de otra tabla, estableciendo una relación entre ellas.

Es importante porque garantiza la integridad referencial, no se puede insertar un registro con una FK que no exista en la tabla referenciada, ni eliminar un registro padre si tiene hijos dependientes.

*Ejemplo:* En una tabla `Orders`, el campo `CustomerId` es una FK que apunta a `Customers.Id`.

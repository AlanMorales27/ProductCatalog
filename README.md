# Product Catalog

Aplicación web para gestión de catálogo de productos. Backend en ASP.NET Core 8 con Entity Framework Core y SQL Server. Frontend en React 19 con TypeScript y Vite.

---

## Requisitos previos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- [Node.js 18+](https://nodejs.org/)
- SQL Server o SQL Server Express

---

## 1. Configurar la cadena de conexión

Abre [server/appsettings.json](server/appsettings.json) y edita el valor de `DefaultConnection` con los datos de tu instancia de SQL Server:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=TU_SERVIDOR;Database=ProductDb;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=True"
}
```

Ejemplos comunes:

| Escenario | `Server=` |
|---|---|
| SQL Server Express local | `.\SQLEXPRESS` o `localhost\SQLEXPRESS` |
| SQL Server local por defecto | `.` o `localhost` |
| Instancia nombrada | `NOMBRE_PC\INSTANCIA` |

Si usas autenticación por usuario y contraseña en lugar de Windows Auth, reemplaza `Integrated Security=True` por `User Id=usuario;Password=contraseña`.

---

## 2. Aplicar migraciones

Desde la carpeta `server/`, ejecuta:

```powershell
cd server
dotnet ef database update
```

Esto creará la base de datos `ProductDb` y aplicará todas las migraciones, incluyendo los datos de prueba iniciales.

> Si no tienes instalada la herramienta `dotnet-ef`, instálala con:
> ```powershell
> dotnet tool install --global dotnet-ef
> ```

---

## 3. Iniciar el backend

Desde la carpeta `server/`:

```powershell
cd server
dotnet run
```

El servidor quedará disponible en:

- HTTP: `http://localhost:5230`
- Swagger UI: `http://localhost:5230/swagger`

---

## 4. Iniciar el frontend

En una terminal separada, desde la carpeta `client/`:

```powershell
cd client
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

---

## Estructura del proyecto

```
ProductCatalog/
├── server/          # ASP.NET Core 8 — API REST
│   ├── Controllers/
│   ├── Data/
│   ├── Migrations/
│   ├── Models/
│   ├── Services/
│   └── appsettings.json
└── client/          # React 19 + TypeScript + Vite
    └── src/
        ├── api/
        ├── components/
        └── hooks/
```

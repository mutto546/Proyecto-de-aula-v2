# 🎯 Rumbas API

API REST profesional desarrollada en **ASP.NET Core 8** para la gestión de proyectos (Rumbas), clientes y autenticación con JWT.

---

## 🔧 Stack Tecnológico

| Tecnología | Descripción |
|---|---|
| ASP.NET Core 8 | Framework principal |
| Entity Framework Core 8 | ORM para SQL Server |
| SQL Server | Base de datos relacional |
| JWT Bearer | Autenticación basada en tokens |
| AutoMapper | Mapeo de entidades a DTOs |
| FluentValidation | Validación de datos |
| Swagger (Swashbuckle) | Documentación interactiva de la API |
| BCrypt | Hash seguro de contraseñas |

---

## 📁 Arquitectura del Proyecto

El proyecto sigue una **arquitectura en capas** limpia y modular:

```
RumbasAPI/
│
├── Controllers/          → Reciben peticiones y devuelven respuestas (sin lógica)
│   ├── AuthController        POST register, login, logout
│   ├── UsersController       GET /me
│   ├── RumbasController      CRUD + completar + delete múltiple
│   └── ClientesController    CRUD completo
│
├── Services/             → Lógica de negocio
│   ├── AuthService           Registro, login, generación JWT
│   ├── UserService           Consulta de usuario actual
│   ├── RumbaService          CRUD con validación de ownership
│   └── ClienteService        CRUD con validación de ownership
│
├── Repositories/         → Acceso a datos (Entity Framework)
│   ├── UserRepository
│   ├── RumbaRepository
│   └── ClienteRepository
│
├── Models/               → Entidades de la base de datos
│   ├── User
│   ├── Rumba
│   ├── RumbaEstado (enum)
│   └── Cliente
│
├── DTOs/                 → Objetos de transferencia de datos
│   ├── Auth/         RegisterDto, LoginDto, AuthResponseDto
│   ├── Users/        UserDto
│   ├── Rumbas/       RumbaDto, CreateRumbaDto, UpdateRumbaDto, DeleteMultipleRumbasDto
│   └── Clientes/     ClienteDto, CreateClienteDto, UpdateClienteDto
│
├── Validators/           → Validaciones con FluentValidation
├── Data/                 → DbContext (AppDbContext)
├── Middlewares/          → Middleware global de manejo de errores
├── Profiles/             → Perfiles de AutoMapper
├── Program.cs            → Configuración y Dependency Injection
└── appsettings.json      → Connection string y configuración JWT
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB, Express o completo)
- [Visual Studio Community 2022+](https://visualstudio.microsoft.com/) (recomendado)

### 1. Clonar o abrir el proyecto

```bash
# Abrir en Visual Studio haciendo doble clic en:
RumbasAPI.csproj
```

### 2. Configurar la base de datos

Edita `appsettings.json` con tu connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RumbasDB;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

> **Con usuario y contraseña:**
> ```
> Server=localhost;Database=RumbasDB;User Id=sa;Password=TuPassword;TrustServerCertificate=true;
> ```

### 3. Crear la base de datos (Migraciones)

**Opción A — Consola del Administrador de Paquetes (Visual Studio):**

```powershell
Add-Migration InitialCreate
Update-Database
```

**Opción B — Terminal:**

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Ejecutar

```bash
dotnet run
```

O presiona **F5** en Visual Studio.

📍 Swagger UI disponible en: `https://localhost:{puerto}/swagger`

---

## 📋 Endpoints

### 🔐 Autenticación (Auth)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | ❌ | Iniciar sesión (devuelve JWT) |
| `POST` | `/api/auth/logout` | ✅ | Cerrar sesión |

### 👤 Usuarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/users/me` | ✅ | Obtener perfil del usuario actual |

### 🎯 Rumbas (Proyectos)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/rumbas` | ✅ | Listar mis rumbas |
| `POST` | `/api/rumbas` | ✅ | Crear nueva rumba |
| `PUT` | `/api/rumbas/{id}` | ✅ | Actualizar rumba |
| `DELETE` | `/api/rumbas/{id}` | ✅ | Eliminar rumba |
| `DELETE` | `/api/rumbas` | ✅ | Eliminar múltiples (body: ids[]) |
| `PATCH` | `/api/rumbas/{id}/completar` | ✅ | Marcar como completada |

### 👥 Clientes

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/clientes` | ✅ | Listar mis clientes |
| `POST` | `/api/clientes` | ✅ | Crear nuevo cliente |
| `PUT` | `/api/clientes/{id}` | ✅ | Actualizar cliente |
| `DELETE` | `/api/clientes/{id}` | ✅ | Eliminar cliente |

---

## 📝 Ejemplos de Requests

### Registrar usuario

```http
POST /api/auth/register
Content-Type: application/json

{
    "nombre": "Roberto García",
    "email": "roberto@email.com",
    "password": "MiPassword123"
}
```

### Iniciar sesión

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "roberto@email.com",
    "password": "MiPassword123"
}
```

**Respuesta:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "nombre": "Roberto García",
    "email": "roberto@email.com"
}
```

### Crear cliente

```http
POST /api/clientes
Authorization: Bearer {tu_token}
Content-Type: application/json

{
    "nombre": "Empresa XYZ",
    "email": "contacto@xyz.com",
    "telefono": "+57 300 1234567"
}
```

### Crear rumba

```http
POST /api/rumbas
Authorization: Bearer {tu_token}
Content-Type: application/json

{
    "nombre": "Diseño de Landing Page",
    "descripcion": "Crear landing page para campaña de verano",
    "fechaLimite": "2026-06-15T00:00:00",
    "clienteId": 1
}
```

### Marcar rumba como completada

```http
PATCH /api/rumbas/1/completar
Authorization: Bearer {tu_token}
```

### Eliminar múltiples rumbas

```http
DELETE /api/rumbas
Authorization: Bearer {tu_token}
Content-Type: application/json

{
    "ids": [1, 2, 3]
}
```

---

## 🔒 Seguridad

- **JWT** para autenticación stateless
- **BCrypt** para hash de contraseñas
- **Validación de ownership**: cada usuario solo puede ver y modificar sus propios datos
- **[Authorize]** en todos los endpoints protegidos
- **Middleware global** de manejo de errores con respuestas JSON consistentes
- **FluentValidation** para validar todos los datos de entrada

---

## 🔑 Uso del JWT en Swagger

1. Ejecuta `POST /api/auth/register` o `POST /api/auth/login`
2. Copia el `token` de la respuesta
3. Haz clic en el botón **🔓 Authorize** (esquina superior derecha)
4. Pega el token (sin escribir "Bearer", solo el token)
5. Clic en **Authorize** → ¡Listo!

---

## 📦 Paquetes NuGet

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.11" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.11" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.11" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.11" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="BCrypt.Net-Next" Version="4.1.0" />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="12.0.1" />
<PackageReference Include="FluentValidation.AspNetCore" Version="11.3.1" />
```

---

## 📄 Licencia

Este proyecto es de uso personal/educativo.

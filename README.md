# Reto Técnico – Products (NestJS + Vue 3)

Reto técnico **Fullstack Dev** (Vende):

- **backend/** → API REST con **NestJS + Prisma + PostgreSQL (Docker)**.
- **frontend/** → SPA con **Vue 3 + Composition API + Vite**.

---

## Requisitos
- Node.js **20.19.0+** 
- Docker y Docker Compose
- npm o pnpm

---

## Backend (NestJS + Prisma)
Directorio: `backend/`

### Levantar entorno
```bash
cd backend
npm install
docker compose up -d
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Endpoints principales
- `GET /api/companies`  Lista las compañías disponibles.
- `GET /api/products`  Lista todos los productos.
- `POST /api/products`  Crea un producto.

#### Ejemplo `POST /api/products`
```json
{
  "name": "Laptop Gamer",
  "sku": "LP-002",
  "price": 19999.99,
  "companyId": "UUID_REAL"
}
```

### Documentación interactiva
- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Frontend (Vue 3 + Vite)
Directorio: `frontend/`

### Levantar entorno
```bash
cd frontend
npm install
npm run dev
```

Aplicación disponible en: [http://localhost:5173](http://localhost:5173)

### Funcionalidad
- **Tabla de productos** con datos de la API.
- **Formulario de creación** de productos:
  - Nombre
  - SKU
  - Precio
  - Selección de compañía

---

## Notas técnicas
- **ORM**: Prisma (con cliente tipado y migraciones).
- **Base de datos**: PostgreSQL (contenedor Docker).
- **Validaciones**: `class-validator` en DTOs de NestJS.
- **CORS**: habilitado para `http://localhost:5173`.
- **Seed inicial**: crea compañías (`Vende S.A.`, `Acme Corp`).

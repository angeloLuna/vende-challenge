# Reto Técnico – Products (NestJS + Vue 3)

Reto técnico **Fullstack Dev** (Vende):

- **backend/**  API REST con **NestJS + Prisma + PostgreSQL (Docker)**.
- **frontend/**  SPA con **Vue 3 + Composition API + Vite**.

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
- Swagger: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

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

## Demo

El proyecto está desplegado en la nube para su revisión:

- **Frontend (SPA en Vue 3)**: [https://vende-challenge.vercel.app/](https://vende-challenge.vercel.app/)
- **Backend (NestJS microservicio ms-products)**: [https://vende-challenge.onrender.com/api](https://vende-challenge.onrender.com/api)

> Importante: Render apaga el servicio cuando no está en uso.  
> La primera vez que accedas puede tardar unos segundos en encenderse.  
> Para verificar que el backend está disponible, consulta directamente la URL del servicio:  
> [https://vende-challenge.onrender.com/api](https://vende-challenge.onrender.com/api).
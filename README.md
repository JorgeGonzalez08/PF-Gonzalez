# 📚 Índice

- [🌐 URL de DockerHub](#url-de-dockerhub)
- [🌐 URL de Railway](#url-de-railway)
- [📝 Documentacion en Swagger](#documentacion-en-swagger)
- [🧪 Realizar pruebas](#realizar-pruebas)
- [⚙️ Variables de entorno implementadas](#variables-de-entono-implementadas-en-envtest)
- [Entrega final: Ecommerce API](#entrega-final-ecommerce-api)
  - [🚀 Tecnologías utilizadas](#tecnologías-utilizadas)
  - [📂 Estructura de carpetas](#estructura-de-carpetas)
  - [⚙️ Entornos](#entornos)
  - [📦 Scripts](#scripts)
  - [🚀 Levantar el servidor](#levantar-el-servidor)
  - [🧪 Ejecutar pruebas](#ejecutar-pruebas)
  - [⚠️ Advertencias](#advertencias)
  - [📌 Rutas implementadas](#rutas-implementadas)
    - [/api/products](#apiproducts)
    - [/api/carts](#apicarts)
    - [/api/sessions](#apisessions)
    - [Vistas renderizadas](#vistas-renderizadas-viewsrouter)
  - [✍️ Autor](#autor)

# URL de DockerHub

```bash
docker pull jorge2508/entregafinal-70435:1.0.0
```
Este comando descarga la imagen de docker hub, una ves descargada ejecutar el siguiente comando para levantar el servidor
```bash
docker run -p 8080:8080 jorge2508/entregafinal-70435:1.0.0
```

# URL de Railway

Login => https://pf-gonzalez-production.up.railway.app/login

Registro => https://pf-gonzalez-production.up.railway.app/register

# Documentacion en Swagger

```bash
http://localhost:8080/api/docs/
```

# Realizar pruebas

**Antes de levantar el servidor ejecuta:**

```bash
npm install
```

**Levantar el servidor en el entorno test**

```bash
npm test
```

**Ejecutar pruebas**

Con el siguiente comando ejecutar las pruebas realizadas en mocha-chai y supertest

```bash
npm run super
```

---

# Variables de entono implementadas en `.env.test`

```env
PORT=7000
MONGO_URL='mongodb+srv://jorge2508:Jorge2508@cluster0.p5kr7.mongodb.net/back03-test'
SECRET_WORD='coderhouse'
SECRET_COOKIE='coderCookieToken'
```

# Entrega final: Ecommerce API

API para gestión de productos, carritos, autenticación de usuarios y vistas renderizadas con protección de roles. Desarrollado con Node.js, Express y MongoDB.

## Tecnologías utilizadas

- **Node.js**
- **Express**
- **MongoDB** + **Mongoose**
- **Passport** (estrategia JWT personalizada)
- **Handlebars**
- **jsonwebtoken**
- **dotenv**
- **Mocha + Chai + Supertest** (para pruebas)

---

## Estructura de carpetas

```
src/

├── config/
│   └── env.js
├── controllers/
├── dao/
|   └── model/
├── docs/
├── dto/
├── helpers/
|   └── erros/
|   └── mocks/
├── middlewares/
├── public/
|   └── css/
|    └── images/
|    └── js/
├── repositories/
├── routes/
├── services/
├── views/
|    └── layouts/
├── app.js
├── connectionDB.js
└── utils.js

test/
└── supertest/         # Pruebas automáticas
```

---

## Entornos

Crea los siguientes archivos `.env` en la raíz del proyecto:

### `.env.test`

```env
PORT=7000
MONGO_URL='mongodb+srv://jorge2508:Jorge2508@cluster0.p5kr7.mongodb.net/back03-test'
SECRET_WORD='coderhouse'
SECRET_COOKIE='coderCookieToken'
```

### `.env.dev`

```env
PORT=devPort
MONGO_URL=devURL
SECRET_WORD=devSecret
SECRET_COOKIE=devCookie
```

### `.env.prod`

```env
PORT=prodPort
MONGO_URL=prodURL
SECRET_WORD=prodSecret
SECRET_COOKIE=prodCookie
```

---

## Scripts

En el `package.json`:

```json
"scripts": {
  "start": "node ./src/app.js --mode=prod",
  "dev": "node --watch ./src/app.js --mode=dev",
  "test": "node ./src/app.js --mode=test",
  "super": "mocha ./test/supertest --mode=test"
}
```

---

## Levantar el servidor

### Antes de levantar el servidor ejecuta:

```bash
npm install
```

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

### Modo test

```bash
npm test
```

---

## Ejecutar pruebas

```bash
npm run super
```

Esto ejecuta las pruebas en supertest usando la base de datos de testing definida en `.env.test`.

---

## Advertencias

- **No ejecutar pruebas sobre producción.**
- Usa `npm test` para pruebas.
- MongoDB debe estar corriendo en local o en Atlas.

---

## Rutas implementadas

### `/api/products`

| Método | Ruta    | Descripción                 |
| ------ | ------- | --------------------------- |
| GET    | `/`     | Obtener todos los productos |
| GET    | `/:pid` | Obtener producto por ID     |
| POST   | `/`     | Crear un nuevo producto     |
| PUT    | `/:pid` | Actualizar un producto      |
| DELETE | `/:pid` | Eliminar un producto        |

---

### `/api/carts`

| Método | Ruta                  | Descripción                      |
| ------ | --------------------- | -------------------------------- |
| GET    | `/:cid`               | Obtener carrito por ID           |
| POST   | `/`                   | Crear nuevo carrito              |
| POST   | `/:cid/products/:pid` | Agregar producto al carrito      |
| DELETE | `/:cid/products/:pid` | Eliminar producto del carrito    |
| DELETE | `/:cid`               | Vaciar carrito                   |
| PUT    | `/:cid`               | Reemplazar contenido del carrito |
| PUT    | `/:cid/products/:pid` | Actualizar cantidad de producto  |

---

### `/api/sessions`

| Método | Ruta        | Descripción                  |
| ------ | ----------- | ---------------------------- |
| POST   | `/register` | Registro de usuario          |
| POST   | `/login`    | Inicio de sesión             |
| GET    | `/current`  | Obtener usuario actual (JWT) |
| POST   | `/logout`   | Cierre de sesión             |

---

### Vistas renderizadas (`viewsRouter`)

| Ruta                | Descripción                                  |
| ------------------- | -------------------------------------------- |
| `/products`         | Catálogo paginado de productos (autenticado) |
| `/products/:pid`    | Detalle de producto                          |
| `/carts/:cid`       | Visualizar carrito                           |
| `/ticket/:code`     | Ver ticket                                   |
| `/realtimeproducts` | Vista en tiempo real (solo admin)            |
| `/register`         | Página de registro                           |
| `/login`            | Página de inicio de sesión                   |

---

## Autor

- **Jorge Luis Gonzalez**

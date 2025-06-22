import { expect } from 'chai';
import supertest from 'supertest';
import '../../src/helpers/env.js';

const requester = supertest(`http://localhost:${process.env.PORT}/api`);
let userCookie;
let testProductId;
let testCartId;
describe('Testing: Router de sesiones (/api/sessions) Login/Register', () => {
  it('Debería registrar un nuevo usuario exitosamente [POST /api/sessions/register]', async function () {
    this.timeout(5000);
    const mockUser = {
      first_name: `Test_${Date.now()}`,
      last_name: 'User',
      email: `testuser_${Date.now()}@example.com`,
      age: 25,
      password: 'password123',
    };

    const response = await requester
      .post('/sessions/register')
      .set('Accept', 'application/json')
      .send(mockUser);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('User registered');
  });
  it('Debería iniciar sesión y devolver una cookie de autenticación [POST /api/sessions/login]', async () => {
    const userCredentials = {
      first_name: 'ana',
      password: 'ana',
    };
    const response = await requester
      .post('/sessions/login')
      .set('Accept', 'application/json')
      .send(userCredentials);

    expect(response.status).to.equal(200);
    const cookies = response.headers['set-cookie'];

    expect(cookies).to.be.an('array').that.is.not.empty;

    const sessionCookie = cookies.find((cookie) =>
      cookie.startsWith('coderCookieToken=')
    );
    expect(sessionCookie).to.exist;

    userCookie = sessionCookie;
  });
  it('Debería obtener los datos del usuario actual con la cookie [GET /api/sessions/current]', async () => {
    if (!userCookie) {
      this.skip();
    }

    const response = await requester
      .get('/sessions/current/json')
      .set('Cookie', userCookie);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.payload).to.have.property('user_name');
    expect(response.body.payload.user_name).to.equal('ana');

    testCartId = response.body.payload.cart;
    expect(testCartId).to.exist;
  });
});

describe('Router de Productos (/api/products)', () => {
  it('Debería obtener la lista de productos [GET /api/products]', async () => {
    const response = await requester.get('/products');
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.products).to.be.an('array');
  });

  it('Debería crear un nuevo producto (requiere autenticación de admin) [POST /api/products]', async () => {
    if (!userCookie) {
      this.skip();
    }

    const newProduct = {
      title: 'Producto de Test',
      description: 'Descripción del producto de test',
      price: 150,
      code: `TEST${Date.now()}`,
      stock: 50,
      category: 'test',
      status: true,
    };

    const response = await requester
      .post('/products')
      .set('Cookie', userCookie)
      .send(newProduct);
    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal('created product');
    expect(response.body.product).to.have.property('_id');

    testProductId = response.body.product._id;
  });

  it('Debería obtener un producto por su ID [GET /api/products/:pid]', async () => {
    if (!testProductId) {
      this.skip();
    }

    const response = await requester.get(`/products/${testProductId}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('_id', testProductId);
  });

  it('Deberia actualizar un producto por si ID (requiere autenticación de admin) [PUT /api/products/:pid]', async () => {
    if (!userCookie) {
      this.skip();
    }

    const updateProduct = {
      title: 'Producto de Test 01',
      description: 'Descripción del producto de test',
      price: 250,
      code: `TEST_${Date.now()}`,
      stock: 500,
      category: 'test',
      status: false,
    };
    const response = await requester
      .put(`/products/${testProductId}`)
      .set('Cookie', userCookie);
    expect(response.status).equal(200);
    expect(response.body.status).to.equal('updated product');
  });

  it('Debería eliminar un producto por su ID (requiere autenticación de admin) [DELETE /api/products/:pid]', async () => {
    if (!testProductId || !userCookie) {
      this.skip();
    }

    const response = await requester
      .delete(`/products/${testProductId}`)
      .set('Cookie', userCookie);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('deleted product');

    const verifyResponse = await requester.get(`/products/${testProductId}`);
    expect(verifyResponse.status).to.equal(404);
  });
});

describe('Router de Carritos (/api/carts)', () => {
  let productForCartId;
  let cartId;

  before(async function () {
    if (!userCookie) {
      this.skip();
    }
    const newProduct = {
      title: 'Producto para Carrito',
      description: 'desc',
      price: 10,
      code: `CARTPROD${Date.now()}`,
      stock: 20,
      category: 'test',
    };
    const res = await requester
      .post('/products')
      .set('Cookie', userCookie)
      .send(newProduct);
    productForCartId = res.body.product._id;
  });

  it('Debería agregar un producto al carrito del usuario [POST /api/carts/:cid/products/:pid]', async () => {
    if (!userCookie || !testCartId || !productForCartId) {
      this.skip();
    }

    const response = await requester
      .post(`/carts/${testCartId}/products/${productForCartId}`)
      .set('Cookie', userCookie);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(
      `Se agregó el producto ${productForCartId} al carrito ${testCartId} exitosamente!`
    );
  });

  it('Debería obtener el contenido del carrito [GET /api/carts/:cid]', async () => {
    if (!userCookie || !testCartId) {
      this.skip();
    }

    const response = await requester
      .get(`/carts/${testCartId}`)
      .set('Cookie', userCookie);
    expect(response.status).to.equal(200);
    expect(response.body.products).to.be.an('array');

    const productInCart = response.body.products.find(
      (p) => p.product._id === productForCartId
    );
    expect(productInCart).to.exist;
    expect(productInCart.quantity).to.equal(1);
  });

  it('Debería eliminar un producto del carrito [DELETE /api/carts/:cid/products/:pid]', async () => {
    if (!userCookie || !testCartId || !productForCartId) {
      this.skip();
    }

    const response = await requester
      .delete(`/carts/${testCartId}/products/${productForCartId}`)
      .set('Cookie', userCookie);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Producto Eliminado del carrito.');
  });
  it('Deberia crear un carrito [POST /api/carts/]', async () => {
    const response = await requester.post('/carts');

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('created cart');
    cartId = response.body.newCart._id;

    expect(cartId).to.exist;
  });
  it('Deberia agregar productos al carrito creado [PUT /api/carts/:cid]', async () => {
    const updateCart = {
      products: [
        {
          quantity: 588,
        },
      ],
    };
    const response = await requester.put(`/carts/${cartId}`).send(updateCart);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('updated cart');
  });
  it('Deberia eliminar los productos del carrito creado [PUT /api/carts/:cid]', async () => {
    const response = await requester.delete(`/carts/${cartId}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('empty cart');
  });
  after(async function () {
    if (!productForCartId || !userCookie) {
      this.skip();
    }

    const response = await requester
      .delete(`/products/${productForCartId}`)
      .set('Cookie', userCookie);
  });
});

describe('Router de sesiones (/api/sessions) Logout', async () => {
  it('Deberia cerrar la sesion [POST /api/sessions/logout]', async () => {
    const response = await requester
      .post('/sessions/logout')
      .set('Accept', 'application/json');
    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.message).to.equal('logout successful');
  });
});

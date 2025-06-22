import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { productsRouter } from './routes/productsRouter.js';
import { cartsRouter } from './routes/cartsRouter.js';
import { viewsRouter } from './routes/viewsRouter.js';
import { connectDB } from './connectionDB.js';
import { ProductsManagerMongoose } from './dao/ProductsManagerMoongose.js';
import { initializePassport } from './config/passportConfig.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { sessionsRouter } from './routes/sessionsRouter.js';
import args from './helpers/arguments.herlpers.js';
import './helpers/env.js';
import { mocksRouter } from './routes/mocks.router.js';
import logger from './helpers/logger.helper.js';
import { winston } from './middleware/winston.mid.js';
import { serve, setup } from 'swagger-ui-express';
import swaggerSpecs from './helpers/swagger.helppers.js';
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();
app.use(winston);
app.use(express.static('./src/public'));
app.use('/api/docs', serve, setup(swaggerSpecs));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/', viewsRouter);

app.get('/products', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ payload: 'OK' });
});
app.get('/carts', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ payload: 'OK' });
});

const serverHTTP = app.listen(PORT, () => {
  logger.INFO(`🟢 Puerto: ${PORT} `);
});

const io = new Server(serverHTTP);

io.on('connection', (socket) => {
  logger.INFO('Cliente conectado');

  ProductsManagerMongoose.getAllProducts().then((products) => {
    socket.emit('updateProducts', products);
  });

  socket.on('newProduct', async (product) => {
    try {
      const products = await ProductsManagerMongoose.getAllProducts();
      let exists = products.find((prod) => prod.title === product.title);
      if (exists) {
        socket.emit('error', 'El producto ya existe');
        return;
      }
      await ProductsManagerMongoose.addProduct(product);
      io.emit('updateProducts', products);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('deleteProduct', async (productCode) => {
    try {
      await ProductsManagerMongoose.deleteProduct(productCode);
      const products = await ProductsManagerMongoose.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
});

connectDB(process.env.MONGO_URL);

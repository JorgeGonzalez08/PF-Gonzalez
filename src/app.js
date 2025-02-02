import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { productsRouter } from './routes/productsRouter.js';
import { cartsRouter } from './routes/cartsRouter.js';
import { viewsRouter } from './routes/viewsRouter.js';
import { connectDB } from './connectionDB.js';
import { ProductsManagerMongoose } from './dao/ProductsManagerMoongose.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./src/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts',cartsRouter);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/', viewsRouter);

app.get('/products',(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(200).json({payload:'OK'});
})
app.get('/carts',(req,res)=>{
    res.setHeader('Content-Type','application/json');
    res.status(200).json({payload:'OK'});
})

const serverHTTP =app.listen(PORT,()=>{
    console.log(`servidor corriendo en el puerto ${PORT}`);
})

const io = new Server(serverHTTP);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    ProductsManagerMongoose.getAllProducts().then((products) => {
        socket.emit('updateProducts', products);
    });

    socket.on('newProduct', async (product) => {
        try {
            const products = await ProductsManagerMongoose.getAllProducts();
            let exists = products.find(prod => prod.title === product.title);
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

connectDB(
    'mongodb+srv://jorge2508:Jorge2508@cluster0.p5kr7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    'eccomerce'
);
import {Router} from 'express';
import { ProductsManagerMongoose } from '../dao/ProductsManagerMoongose.js';
import { processError } from '../utils.js';
import { CartsManagerMongoose } from '../dao/CartsManagerMongoose.js';

export const viewsRouter = Router();

viewsRouter.get('/products', async (req, res) => {
    let {page}= req.query;
    let limit = 10
    if (!page) {
        page = 1;
    }
    let carts = await CartsManagerMongoose.getCarts();
    let {docs:products,totalPages, hasPrevPage, prevPage, hasNextPage, nextPage} = await ProductsManagerMongoose.getProducts(page,limit);
    res.render('index',
        {
            products,
            totalPages,
            hasPrevPage,
            prevPage,
            hasNextPage,
            nextPage,
            limit,
            carts
        });
});

viewsRouter.get('/products/:pid',async(req,res)=>{
    try {
        let products = await ProductsManagerMongoose.getAllProducts();
        let carts = await CartsManagerMongoose.getCarts();
        let product = products.find(item => item._id == req.params.pid);
        if(!product){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe producto con pid ${req.params.pid}`})
        }
        res.render("products", {
            product,carts
        })
    } catch (error) {
        processError(error,res);
    }
})

viewsRouter.get('/carts/:cid',async(req,res)=>{
    try {
      
        let cart = await CartsManagerMongoose.getCartById(req.params.cid);
        res.render('cart',{cart})
    } catch (error) {
        processError(error,res)
    }
})

viewsRouter.get('/realtimeproducts', async(req, res) => {
    res.render('realTimeProducts');
});

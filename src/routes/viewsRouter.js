import {Router} from 'express';
import { ProductsManagerMongoose } from '../dao/ProductsManagerMoongose.js';
import { processError } from '../utils.js';
import { CartsManagerMongoose } from '../dao/CartsManagerMongoose.js';
import { onlyAdmin,onlyUser } from '../middleware/auth.js';
import passport from 'passport';
import ProductService from "../services/product.service.js";
import CartService from "../services/cart.service.js";
import TicketService from "../services/ticket.service.js";
import logger from '../helpers/logger.helper.js';

export const viewsRouter = Router();

viewsRouter.get('/products',passport.authenticate('current',{session:false}),onlyUser, async (req, res) => {

    try {

        const cid = req.user.cart;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'price';
        const order = req.query.order === 'desc' ? -1 : 1;
        const category = req.query.category || '';

        const filter = {};
        if (category) {
            filter.category = category;
        }

        const options = {
            limit,
            page,
            sort: { [sort]: order },
            lean: true
        };

        const products = await ProductService.paginateProducts(filter, options);

        if (!products.docs || products.docs.length === 0) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encontraron productos en esta página'
            });
        }


        const payload = {
            payload: products.docs,
            cartId: cid,
            status: "success",
            pagination: {
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage
            },
            query: {
                sort,
                category,
                limit
            }
        };

        res.status(200).render("index", {
            products: payload.payload,
            pagination: payload.pagination,
            query: payload.query,
            cid: cid
        });

    } catch (error) {
        logger.ERROR("Error al obtener productos:", error);
        res.status(500).send("Hay un error del servidor, no podemos mostrar los productos");
    }
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
    
    const { cid } = req.params;
    try {
        const cart = await CartService.getCartById(cid);
        if (!cart) {
            res.send(`No hay un carrito con el id ${cid}`);
            return;
        }
            const productInCart = cart.products
            .filter(product => product.product) 
            .map(product => ({
            productId: product.product._id,
            quantity: product.quantity,
            title: product.product.title,
            price: product.product.price,
            category: product.product.category,
            thumbnails: product.product.thumbnails
        }));
        res.render("cart", { cart: productInCart, cid: cid });

    } catch (error) {
        res.status(500).send("Hay un error , no es posible mostrar el carrito.");
        throw error;

    }
})


viewsRouter.get("/ticket/:code", async (req, res) => {
    const { code } = req.params;

    try {
        const ticket = await TicketService.findTicketByCode(code);

        if (!ticket) {
            return res.status(404).send("Ticket no encontrado.");
        }

        const plainTicket = JSON.parse(JSON.stringify(ticket));

        return res.render("ticket", { ticket: { purchaseTicket: plainTicket } });
    } catch (error) {
        logger.ERROR("Error al obtener el ticket:", error);
        return res.status(500).send("Error al mostrar el ticket.");
    }
});



viewsRouter.get('/realtimeproducts',passport.authenticate('current',{session:false}),onlyAdmin, async(req, res) => {
    res.render('realTimeProducts');
});

viewsRouter.get("/register", (req, res) => {
    res.render("register"); 
 })
 
 viewsRouter.get("/login", (req, res) => {
    res.render("login"); 
 })
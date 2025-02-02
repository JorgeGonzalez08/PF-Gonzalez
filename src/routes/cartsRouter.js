import { Router } from "express";
import { CartsManagerMongoose } from "../dao/CartsManagerMongoose.js";
import { ProductsManagerMongoose } from "../dao/ProductsManagerMoongose.js";
import { processError } from "../utils.js";


export const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {

    let { cid, products } = req.body;
    if (cid || products) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ status: 'error', payload: `No está permitido agregar ningun valor en cid y products` })
    }
    try {
        let newCart = await CartsManagerMongoose.createCarts()

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ status: "success", payload: newCart })
    } catch (error) {
        processError(error, res);
    }


})

cartsRouter.get("/:cid", async (req, res) => {

    let { cid } = req.params;
    try {

        let cart = await CartsManagerMongoose.getCartById(cid)

        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `No existe carrito con cid ${cid}` })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ status: "success", payload: cart });

    } catch (error) {
        processError(error, res);
    }
})

cartsRouter.post("/:cid/product/:pid", async (req, res) => {

    let { cid, pid } = req.params

    let product = await ProductsManagerMongoose.getProductById(pid);

    if (!product) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ status: 'error', payload: `No existe producto con pid ${pid}` })
    }
    let cart = await CartsManagerMongoose.getCartById(cid)

    if (!cart) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(404).json({ status: 'error', payload: `No existe carrito con cid ${cid}` })
    }

    try {
        let carts = await CartsManagerMongoose.getCarts();
        let cart = carts.find(c => c._id == cid);
        let indexProduct = cart.products.findIndex(item => item.pid._id == pid)

        if (indexProduct == -1) {
            cart.products.push({ pid })
        } else {
            cart.products[indexProduct].quantity++
        }

        let addProductToCart = await CartsManagerMongoose.addProductToCart(cid, cart);

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({ status: "success", payload: `producto agregado al carrito: ${cid}`, addProductToCart })

    } catch (error) {
        processError(error, res);
    }
})

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        let { cid, pid } = req.params;

        let cart = await CartsManagerMongoose.getCartById(cid)

        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `No existe carrito con cid ${cid}` })
        }
        let product = await ProductsManagerMongoose.getProductById(pid);

        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `No existe producto con pid ${pid}` })
        }

        const updatedCart = await CartsManagerMongoose.deleteProductCart(cid, pid)

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ status: 'success', payload: "Producto eliminado del carrito", cart: updatedCart });
    } catch (error) {
        processError(error, res)
    }
})

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        let product = await ProductsManagerMongoose.getAllProducts();
        let cart = await CartsManagerMongoose.getCartById(cid);
        if (!cart) {

            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `No existe carrito con cid ${cid}` })
        }
        if (!Array.isArray(products)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Debe enviar un array válido de produts por el body` })
        }

        let error = false
        let productsBody = []
        products.forEach(p => {
            if (!p.pid || p.quantity < 0) {
                error = true
            } else {

                let exists = product.find(item => item._id == p.pid)
                if (!exists) {
                    error = true
                } else {
                    if (productsBody.includes(p.pid)) {
                        error = true
                    } else {
                        productsBody.push(p.pid)
                    }
                }
            }
            if (!p.quantity) {
                p.quantity = 1
            }
        })

        if (error) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ status: 'error', payload: `Hay un error en alguna propiedad de los productos` })
        }

        const statuss = await CartsManagerMongoose.updateCart(cid, products);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ status: statuss });
    } catch (error) {
        processError(error, res)
    }
})

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        let cart = await CartsManagerMongoose.getCartById(cid)

        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `No existe carrito con cid ${cid}` })
        }
        let product = await ProductsManagerMongoose.getProductById(pid);

        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `No existe producto con pid ${pid}` })
        }

        if (!quantity) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `La propiedad ingresada no es valida ` });
        }

        if (isNaN(quantity) || quantity < 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ sstatus: 'error', payload: "Se debe introducir un valor numerico positivo" });
        }

        const newQuantity = await CartsManagerMongoose.updateProductQuantity(cid, pid, quantity);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ status: 'success', payload: "Cantidad actualizada", cart: newQuantity });
    } catch (error) {
        processError(error, res)
    }
})

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        let { cid } = req.params;
        let cart = await CartsManagerMongoose.getCartById(cid)

        if (!cart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `No existe carrito con cid ${cid}` })
        }
        if (cart.products.length == 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ status: 'error', payload: `Este carrito no tiene productos para eliminar` })
        }

        const deleteProducts = await CartsManagerMongoose.deleteProductsCart(cid);
       
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ status: 'success', payload: "Todos los productos han sido eliminados del carrito", cart: deleteProducts });
    } catch (error) {
        processError(error, res)
    }
})


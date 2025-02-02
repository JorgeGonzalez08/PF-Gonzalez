import { Router } from "express";
import { processError } from "../utils.js";
import { ProductsManagerMongoose } from "../dao/ProductsManagerMoongose.js";
import { productsModel } from "../dao/model/productsModel.js";

export const productsRouter = Router();


productsRouter.get("/", async (req, res) => {

    let { page, limit, sort, query } = req.query;
    if (!limit) {
        limit = 10
    }
    if (!page) {
        page = 1;
    }

    if (sort ) {
        let { docs: products, totalPages, hasPrevPage, prevPage, hasNextPage, nextPage } = await ProductsManagerMongoose.getProductsSort(page, limit, sort,query);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ status: 'success', payload: products, totalPages, hasPrevPage, prevPage, hasNextPage, nextPage })
    }
   
    let { docs: products, totalPages, hasPrevPage, prevPage, hasNextPage, nextPage } = await ProductsManagerMongoose.getProducts(page, limit,query);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ status: 'success', payload: products, totalPages, hasPrevPage, prevPage, hasNextPage, nextPage })

})

productsRouter.get("/:pid", async (req, res) => {

    let { pid } = req.params
    try {

        let product = await ProductsManagerMongoose.getProductById(pid)

        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({status:"error", payload: `No existe producto con pid ${pid}` })
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ status: "success", payload: product });

    } catch (error) {
        processError(error, res);
    }
})

productsRouter.post("/", async (req, res) => {

    let { pid, title, description, code, price, stock, category } = req.body

    title = title.trim();
    try {

        if (pid) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ status:"error", payload: `No está permitido agregar pid` })
        }
        if (!title || !description || !code || !price || !stock || !category) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ status:"error", payload: `No se permiten campos vacios` })
        }
        let products = await ProductsManagerMongoose.getAllProducts();

        let exists = products.find(p => p.title.toLocaleLowerCase() == title.trim().toLowerCase() || p.code == code)
        if (exists) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ status:"error", payload: `El titulo o codigo ya existe` })
        }

        let newProduct = await ProductsManagerMongoose.addProduct({ title, description, code, price, stock, category });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ payload: `producto creado `, newProduct })

    } catch (error) {
        processError(error, res)
    }
})

productsRouter.put("/:pid", async (req, res) => {
    let { pid } = req.params;
    let update = req.body;
    try {
        let product = await ProductsManagerMongoose.getProductById(pid)
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({status:"error", payload: `No existe producto con pid ${pid}` })
        }
        if (update.title) {
            let products = await ProductsManagerMongoose.getProducts();
            let exists = products.find(item => item.title.toLowerCase() === update.title.trim().toLowerCase() && item.pid != pid)
            if (exists) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ status:"error", payloadr: `Ya existe un producto con el titulo ${update.title}. Tiene pid ${exists._id}` })
            }
        }
        let updateProduct = await ProductsManagerMongoose.updateProduct(pid, update);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({status:"success", payload: `producto modificado con el pid ${pid}`, updateProduct })

    } catch (error) {
        processError(error, res)
    }
})

productsRouter.delete("/:pid", async (req, res) => {

    let { pid } = req.params;

    let product = await ProductsManagerMongoose.getProductById(pid)
        if (!product) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({status:"error", payload: `No existe producto con pid ${pid}` })
        }
    try {

        let deleteProduct = await ProductsManagerMongoose.deleteProduct(pid);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({status:"success", payload: `producto eliminado con el id ${pid}`, deleteProduct })

    } catch (error) {
        processError(error, res)
    }
})
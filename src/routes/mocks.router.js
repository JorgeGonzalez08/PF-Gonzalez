import { Router } from "express";
import {createMockProduct} from "../helpers/mocks/products.mock.js";
import productService from "../services/product.service.js";
import createMockUser from "../helpers/mocks/users.mock.js";
import userService from "../services/user.service.js";

 export const mocksRouter = Router()


mocksRouter.get('/products/:products',async (req,res)=>{
    const {products} = req.params
    let productsCollection = []
    for (let index = 0; index < products; index++) {
        const product = createMockProduct()
        productsCollection.push(product)
        await productService.addProduct(product)
    }
    res.status(201).json({mocksNumber:products,mocks:productsCollection})
})
mocksRouter.get('/users/:users',async (req,res)=>{
    const {users} = req.params
    let usersCollection = []
    for (let index = 0; index < users; index++) {
        const user = createMockUser()
        usersCollection.push(user)
        await userService.registerUser(user)
    }
    res.status(201).json({mocksNumber:users,mocks:usersCollection})
})


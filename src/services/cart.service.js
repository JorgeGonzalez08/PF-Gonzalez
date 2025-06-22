import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketService from "./ticket.service.js";
import {totalize, buyTime, ticketId} from "../utils.js";
import logger from "../helpers/logger.helper.js";

class CartService {
    async create() {
        try {
            const newCart = await CartRepository.createCart();
            return newCart;
        } catch (error) {
            throw new Error("No fue posible crear el carrito")
        }
    }

    async getCartById(cid){
        try {
            const cart = await CartRepository.getCartById(cid);
            
            
            return cart;
        } catch (error) {
            logger.ERROR("Error al encontrar el carrito:", error,);
            throw new Error("Error al encontrar el carrito");
        }
    }

    async deleteCart(cid){
        try {
            return await CartRepository.deleteCartByid(cid);

        } catch (error) {
            throw new Error("Error al eliminar el carrito");
        }
    }

    async cleanCart(cid){
        try{
            const cart = await CartRepository.getCartById(cid);

            if(!cart || cart.products.length === 0){
                throw new Error("Error al encontrar el carrito");
            }
            cart.products = [];
    
            await cart.save();
    
            return cart;  

        } catch (error) {
            throw new Error("Error al vaciar el carrito");
        }
    }

    async addProduct(cid, pid, quantity = 1){
        try {
            const cart = await CartRepository.getCartById(cid);

            const productExist = cart.products.find(item => item.product.toString() === pid);

            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: pid, quantity });
            }
            cart.markModified("products");

            const updated = await CartRepository.updateCart(cid,cart);
            return updated;
            

        } catch (error) {
            throw new Error("Error al agregar el producto al carrito");
        }
    }


    async updatedCart(cid,cartData){
        try {

            const cart = await CartRepository.getCartById(cid);
            
            if(!cart){
                throw new Error("Error al encontrar el carrito");
            }

        for (const item of cartData.products) {
            const productInCart = cart.products.find(prod => prod.product.toString() === item.product);

            if (productInCart) {
                productInCart.quantity = item.quantity;
            } else {
                cart.products.push({ product: item.product, quantity: item.quantity });
            }
        }

        const updatedCart = await CartRepository.updateCart(cid, cart);
        return updatedCart;

        } catch (error) {
            throw new Error("Error al actualizar el carrito" + error.message);
        }
    }

    async updateProductQuantity(cid, pid, quantity){
        try {
            const cart = await CartRepository.getCartById(cid);
            if(!cart){
                throw new Error("Error al encontrar el carrito");
            }

            const productExist = cart.products.find(item => item.product._id.toString() === pid);

            if(!productExist){
                throw new Error("El producto no existe en el carrito.");
            }
            productExist.quantity = quantity;

            const updatedCart = await CartRepository.updateCart(cid, cart);
            return updatedCart;

        } catch (error) {
            throw new Error("Error al actualizar el carrito");
        }
    }

    async deleteProduct(cid, pid){
        try {
            const result = await CartRepository.productDelete([
                { _id: cid },
                { $pull: { products: { product: pid } } }
            ]);

            if (result.matchedCount === 0) {
                return false;
            }
            return true;


        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito.");
        }
    }

    async purchaseProducts(cid, userEmail) {
        try {
            const cart = await CartRepository.getCartById(cid);
            if (!cart || cart.products.length === 0) {
                throw new Error("El carrito está vacío o no existe.");
            }
    
            const products = cart.products;
            let outStockProducts = [];
            let productsToPurchase = [];
            let totalAmount = 0;
    
            for (let item of products) {
                const product = await ProductRepository.getProductById(item.product);
                if (!product) {
                    throw new Error(`El producto con ID ${item.product} no se encuentra.`);
                }
    
                if (product.stock >= item.quantity) {
                    productsToPurchase.push(item); 
                } else {
                    outStockProducts.push(item); 
                }
            }
    
            if (productsToPurchase.length > 0) {
                for (let item of productsToPurchase) {
                    const product = await ProductRepository.getProductById(item.product);
                    product.stock -= item.quantity;
    
                    await ProductRepository.updateProductById(product._id, product);
                }
    
                totalAmount = totalize(productsToPurchase);
    
                const purchaseTicket = await TicketService.createTicket({
                    code: ticketId(),
                    purchase_datetime: buyTime(),
                    cart: cid,
                    amount: totalAmount,
                    purchaser: userEmail
                });
    
                cart.products = outStockProducts;
                await cart.save();
    
                return {
                    success: true,
                    purchaseTicket, 
                    outStockProducts 
                };
            } else {
                return {
                    success: false,
                    message: "Ningún producto tiene stock suficiente.",
                    outStockProducts
                };
            }
        } catch (error) {
            throw new Error("Error al finalizar la compra: " + error.message);
        }
    }
    
}

export default new CartService();
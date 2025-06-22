import { cartsModel } from "./model/cartsModel.js";

export class CartsManagerMongoose {

    static async getCarts() {
        return await cartsModel.find().populate('products.pid').lean();
    }

    static async getCartById(cid) {
        let carts = await this.getCarts();
        let cart = carts.find(c => c._id == cid);
        return cart;
    }

    static async createCarts() {
        let newCart = {
            products: []
        }
        let cart = await cartsModel.create(newCart);
        return cart.toJSON();
    }

    static async addProductToCart(cid, cart) {
        return await cartsModel.findByIdAndUpdate(cid, cart, { new: true }).lean();
    }

    static async deleteProductCart(cid, pid) {
        const deleteProduct = await cartsModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { pid } } },
            { new: true }
        ).lean();

        return deleteProduct;
    }

    static async deleteProductsCart(cid) {

        const deleteProducts = await cartsModel.findByIdAndUpdate(
            cid,
            { $set: { products: [] } },
            { new: true }
        ).lean();
        return deleteProducts;
    }

    static async updateProductQuantity(cid, pid, quantity) {

        const newQuantity = await cartsModel.findOneAndUpdate(
            { _id: cid, 'products.pid': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        ).lean();

        return newQuantity;
    }

    static async updateCart(cid, products) {

        const result = await cartsModel.findOneAndUpdate(
            { _id: cid },
            { products: products },
            { new: true }
        ).lean();
        return result
    }

}
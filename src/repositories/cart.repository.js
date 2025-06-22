import CartDAO from '../dao/cart.dao.js';
import mongoose from 'mongoose';
import logger from '../helpers/logger.helper.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
class CartRepository {
  async createCart() {
    return await CartDAO.save();
  }

  async getCartById(cid) {
    try {
      if (!isValidObjectId(cid)) {
        throw new Error(`El id ${cid} no es un ObjectId válido`);
      }
      const cart = await CartDAO.findById(cid);
      if (!cart) {
        throw new Error(`No se encontró el carrito con id ${cid}`);
      }
      return cart;
    } catch (error) {
      logger.ERROR(`Error en CartRepository.getCartById: ${error.message}`);
      throw error;
    }
  }

  async addProductToCart(cid, cartData) {
    return await CartDAO.update(cid, cartData);
  }

  async updateCart(cid, cartData) {
    return await CartDAO.update(cid, cartData);
  }

  async deleteCartByid(cid) {
    return await CartDAO.delete(cid);
  }

  async productDelete(cartData) {
    const cid = cartData[0];
    const update = cartData[1];
    return await CartDAO.updateOne(cid, update);
  }
}

export default new CartRepository();

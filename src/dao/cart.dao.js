import mongoose from 'mongoose';
import { cartsModel } from './model/cartsModel.js';

class CartDAO {
  async findById(id) {
    try {
      if (!mongoose.isValidObjectId(id)) {
        throw new Error(`ID inválido: ${id}`);
      }
      return await cartsModel.findById(id).populate('products.product');
    } catch (error) {
      throw new Error('Error al encontrar el carrito: ' + error.message);
    }
  }

  async findOne(query) {
    return await cartsModel.findOne(query);
  }

  async save() {
    const cart = new cartsModel({ products: [] });
    return await cart.save();
  }

  async update(id, cartData) {
    return await cartsModel.findByIdAndUpdate(id, cartData, { new: true });
  }

  async delete(id) {
    return await cartsModel.findByIdAndDelete(id);
  }

  async updateOne(cid, update) {
    return await cartsModel.updateOne({ _id: cid }, update);
  }
}

export default new CartDAO();

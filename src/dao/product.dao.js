import logger from '../helpers/logger.helper.js';
import { productsModel } from './model/productsModel.js';

class ProductDAO {
  async findById(id) {
    try {
      // return await productsModel.findById(id);
      let products = await this.find();
      let product = products.find((p) => p._id == id);
      return product;
    } catch (error) {
      logger.ERROR('Error al buscar el producto:', error);
      throw new Error('Error al buscar el producto.');
    }
  }

  async findOne(query) {
    return await productsModel.findOne(query);
  }

  async find() {
    return await productsModel.find();
  }

  async save(productData) {
    const product = await new productsModel(productData);
    return await product.save();
  }

  async update(id, productData) {
    return await productsModel.findByIdAndUpdate(id, productData, {
      new: true,
    });
  }

  async delete(id) {
    return await productsModel.findByIdAndDelete(id);
  }

  async paginate(filter, options) {
    return await productsModel.paginate(filter, options);
  }
}

export default new ProductDAO();

import ProductDAO from '../dao/product.dao.js';
import mongoose from 'mongoose';
class ProductRepository {
  async createProduct(productData) {
    return await ProductDAO.save(productData);
  }

  async getProducts() {
    return await ProductDAO.find();
  }

  async getProductByCode(code) {
    return await ProductDAO.findOne(code);
  }

  async getProductById(id) {
    return await ProductDAO.findById(id);
  }

  async updateProductById(id, productData) {
    return await ProductDAO.update(id, productData);
  }

  async deleteProductById(id) {
    return await ProductDAO.delete(id);
  }

  async productsPaginate(filter, options) {
    return await ProductDAO.paginate(filter, options);
  }
}

export default new ProductRepository();

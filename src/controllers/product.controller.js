import ProductServices from '../services/product.service.js';

class ProductController {
  async getProducts(req, res) {
    try {
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
        lean: true,
      };

      const products = await ProductServices.paginateProducts(filter, options);

      if (products.docs.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found',
        });
      }

      // respuesta con los datos con paginate.
      res.status(200).json({
        status: 'success',
        products: products.docs,
        pagination: {
          totalDocs: products.totalDocs,
          limit: products.limit,
          totalPages: products.totalPages,
          page: products.page,
          hasPrevPage: products.hasPrevPage,
          hasNextPage: products.hasNextPage,
          prevPage: products.prevPage,
          nextPage: products.nextPage,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Fatal error',
      });
    }
  }

  async getProduct(req, res) {
    const { pid } = req.params;

    try {
      const productFound = await ProductServices.getProduct(pid);

      if (!productFound) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found',
        });
      } else {
        res.status(200).json(productFound);
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Fatal error',
      });
    }
  }

  async newProduct(req, res) {
    const productNew = req.body;
    try {
      if (!productNew) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      } else {
        let product = await ProductServices.addProduct(productNew);
        res.status(201).json({ status: 'created product', product });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Fatal error',
      });
    }
  }

  async productUpdate(req, res) {
    const { pid } = req.params;
    const updateData = req.body;
    try {
      if (!updateData) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      }
      const productFound = await ProductServices.getProduct(pid);
      if (!productFound) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found',
        });
      }
      let updateProduct = await ProductServices.updateProduct(pid, updateData);
      res.status(200).json({ status: 'updated product', updateProduct });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Fatal error',
      });
    }
  }

  async productDelete(req, res) {
    const { pid } = req.params;
    const productFound = await ProductServices.getProduct(pid);
    try {
      if (!pid) {
        return res.status(400).json({ status: 'error', message: 'Invalid id' });
      }

      if (!productFound) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found',
        });
      } else {
        let deleteProduct = await ProductServices.deleteProduct(pid);
        res.status(200).json({ status: 'deleted product', deleteProduct });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Fatal error',
      });
    }
  }
}

export default ProductController;

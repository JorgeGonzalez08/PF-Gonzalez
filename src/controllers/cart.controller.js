import logger from '../helpers/logger.helper.js';
import CartService from '../services/cart.service.js';
class CartController {
  async getCart(req, res) {
    const { cid } = req.params;
    try {
      const cart = await CartService.getCartById(cid);

      if (!cart || cart == null) {
        res.status(404).send(`No se encontró el carrito con id ${cid}`);
        return;
      } else {
        res.send(cart);
      }
    } catch (error) {
      res.status(500).send({
        message: 'Hubo un error al intentar cargar el carrito',
        error: error,
      });
    }
  }

  async newCart(req, res) {
    try {
      const newCart = await CartService.create();
      if (!newCart) {
        res.status(500).send('Error al crear el carrito');
        return;
      }
      res
        .status(201)
        .json({ status: 'success', message: 'created cart', newCart });
    } catch (error) {
      res.status(500).send('Error del servidor al crear el carrito.');
    }
  }

  async DeleteCart(req, res) {
    const { cid } = req.params;

    try {
      await CartService.deleteCart(cid);
      return res.send('Carrito eliminado con exito');
    } catch (error) {
      res.status(500).send('No es posible eliminar el carrito momentaneamente');
    }
  }

  async addProductToCart(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      if (!cid || !pid) {
        res.status(400).send('El id del carrito y del producto son necesarios');
        return;
      }
      const add = await CartService.addProduct(cid, pid, quantity);

      add
        ? res.status(200).send({
            message: `Se agregó el producto ${pid} al carrito ${cid} exitosamente!`,
          })
        : res.status(404).send({
            message: `No es posible agregar el producto ${pid} en el carrito ${cid} `,
          });
    } catch (error) {
      res
        .status(500)
        .send('No es posible agregar el producto al carrito momentaneamente');
    }
  }

  async updateQuantity(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      if (!cid || !pid) {
        res.status(400).send('El id del carrito y del producto son necesarios');
        return;
      }
      if (!quantity || isNaN(quantity) || quantity <= 0) {
        return res.status(400).send('La cantidad debe ser un número positivo.');
      }

      const newQuantity = await CartService.updateProductQuantity(
        cid,
        pid,
        quantity
      );

      res.status(200).send({
        message: 'Cantidad actualizada correctamente.',
        cart: newQuantity,
      });
    } catch (error) {
      res
        .status(500)
        .send(
          'Hubo un problema al actualizar la cantidad del producto en el carrito.'
        );
    }
  }

  async updateCart(req, res) {
    const { cid } = req.params;
    const cartData = req.body;
    try {
      if (!cid) {
        return res.status(404).send('El carrito solicitado no existe');
      }

      if (!cartData || cartData.length === 0) {
        return res.status(404).send('No hay productos para actualizar.');
      }

      const updatedCart = await CartService.updatedCart(cid, cartData);

      res.status(200).json({ message: 'updated cart', cart: updatedCart });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Fatal error',
      });
    }
  }

  async deleteProductInCart(req, res) {
    const { cid, pid } = req.params;

    try {
      const deleteProduct = await CartService.deleteProduct(cid, pid);
      if (!deleteProduct) {
        res.status(404).send('No es posible eliminar el producto');
        return;
      }

      res.status(200).json({ message: 'Producto Eliminado del carrito.' });
    } catch (error) {
      res.status(500).send('Error al intentar eliminar el producto.');
    }
  }

  async cartClean(req, res) {
    const { cid } = req.params;
    try {
      if (!cid) {
        res
          .status(404)
          .send('Es necesario el id del carrito para poder vaciarlo');
      }

      const cleanedCart = await CartService.cleanCart(cid);

      if (!cleanedCart) {
        res.status(404).send('No se encontró el carrito o ya estaba vacío.');
        return;
      }
      res.status(200).json({ status: 'success', message: 'empty cart' });
    } catch (error) {
      res
        .status(500)
        .send('No fue posible vaciar el carrito, prueba nuevamente más tarde.');
    }
  }

  async purchaseCart(req, res) {
    const { cid } = req.params;

    try {
      const result = await CartService.purchaseProducts(cid, req.user.email);

      if (result.outStockProducts.length > 0) {
        return res.status(200).json({
          success: false,
          outStockProducts: result.outStockProducts,
          ticket: result.purchaseTicket || null,
        });
      }
      return res.status(200).json({
        success: true,
        purchaseTicket: result.purchaseTicket,
      });
    } catch (error) {
      logger.ERROR('Error en el proceso de compra:', error);
      return res
        .status(500)
        .send('No pudo finalizarse la compra por un error interno');
    }
  }
}

export default CartController;

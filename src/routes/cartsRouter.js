import { Router } from 'express';
import passport from 'passport';
import CartController from '../controllers/cart.controller.js';
export const cartsRouter = Router();
const cartController = new CartController();

cartsRouter.get('/:cid', cartController.getCart);

cartsRouter.post('/', cartController.newCart);

cartsRouter.post('/:cid/products/:pid', cartController.addProductToCart);

cartsRouter.delete('/:cid/products/:pid', cartController.deleteProductInCart);

cartsRouter.delete('/:cid', cartController.cartClean);

cartsRouter.put('/:cid', cartController.updateCart);

cartsRouter.put('/:cid/products/:pid', cartController.updateQuantity);

cartsRouter.post(
  '/:cid/purchase',
  passport.authenticate('current', { session: false }),
  (req, res, next) => {
    next();
  },
  cartController.purchaseCart
);

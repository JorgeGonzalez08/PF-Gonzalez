import { createContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  const addItem = (item) => {

    setCart((prevCart) => {

      const existingItem = prevCart.find((i) => i.title === item.title && i.selectedStorage === item.selectedStorage && i.selectedColor === item.selectedColor);

      if (existingItem) {
        return prevCart.map((i) =>
          i.title === item.title ? { ...i, count: i.count + item.count } : i
        );
      } else {
        return [...prevCart, item];
      }
    });
  };

  const removeItem = (storage, color) => {
    setCart((prevCart) => prevCart.filter((item) => item.selectedColor !== color || item.selectedStorage !== storage));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.count, 0);

  const totalPrice = cart.reduce((total, item) => total + item.selectedPrice * item.count, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
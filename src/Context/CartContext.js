'use client';
import { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const useCart =()=>{
    const context = useContext(CartContext);
    if(!context){
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, selectedSize, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item._id === product._id &&
          item.selectedSize?.size === selectedSize?.size
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id &&
          item.selectedSize?.size === selectedSize?.size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [ ...prevItems,
        { ...product, selectedSize,quantity},
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item._id === productId && item.selectedSize?.size === size)
      )
    );
  };

  const increaseQty = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId &&
        item.selectedSize?.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId &&
        item.selectedSize?.size === size
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
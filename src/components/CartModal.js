import { useState } from "react";
import { useCart } from "../Context/CartContext";

export default function CartModal({ cartItems, onClose }) {
  const { removeFromCart, increaseQty, decreaseQty } = useCart();

  const total = cartItems.reduce(
    (acc, item) => acc + item.selectedSize.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end items-end md:items-center text-black">
      <div className="bg-white w-full h-full md:max-w-120 p-1 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-xl ease-out transition-all duration-700">✕</button>

        <h2 className="text-2xl font-bold mb-4 mt-2 ms-2">Shopping Cart</h2>
        <div className="bg-gray-100 p-6">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="bg-green-900 h-4 rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(100, (total / 500) * 100)}%` }}></div>
            </div>

            {total >= 500 ? (
              <div className="mt-2">
                <p className="text-green-900 font-bold">🎉 You qualify for free shipping!</p>
              </div>
            ):(
            <div className="flex mt-2">
            <p>Spend Rs 500 to get </p><p className="text-green-900 ms-1">Free shipping!</p>
            </div>
            )
            }
            
        </div>

        {cartItems.length === 0 ? (<p className="text-gray-500 ms-1 p-4">Your cart is empty.</p>) : (
          <>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index} className="flex mb-4 p-4">
                  <img src={item.images?.[0]?.url} alt={item.name} className="w-25 h-30 object-cover rounded mr-4"/>
                  <div className="flex flex-col">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {item.selectedSize?.size}
                    </p>
                    <div className="flex">
                    <p className="text-green-800 font-bold">
                      Rs.{item.selectedSize?.price} 
                    </p>
                    <p className="ms-2 line-through text-gray-400">
                    Rs. {item.selectedSize?.oldPrice}.00
                    </p>
                    </div>
                    
                    <div className="flex border border-gray-200 bg-gray-100 text-black w-max mt-3 py-1">
                    <button onClick={() =>decreaseQty(item._id, item.selectedSize?.size)}className="px-2">−</button>
                    <span className="mx-3 px-1">{item.quantity}</span>
                    <button onClick={() => increaseQty(item._id, item.selectedSize?.size)} className="px-2">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id, item.selectedSize?.size)} className="absolute right-4 mt-9">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
            <div className="bg-gray-100 border border-gray-300 pt-4 mt-4 font-bold text-lg absolute bottom-0 left-0 w-full p-4">
            <div className=" justify-between flex w-full mb-4">
              <span>SubTotal:</span>
              <span>Rs.{total}</span>
            </div>
            <div>
            <button className=" bg-white text-green-950 w-full px-10 py-4 rounded-full">View Cart</button>
            <button className="bg-[#444444] mt-4 text-white w-full px-10 py-4 rounded-full">Checkout</button>
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

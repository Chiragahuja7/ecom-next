'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CartModal from "./CartModal";
import { useCart } from "../Context/CartContext";

export default function Header(){
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, cartItems } = useCart();
    return(
        <header className="bg-[#0f5b3f] p-4">
            <div className="flex justify-between ms-5 mb-4">
                <div className="md:hidden">
                <i className="fa-solid fa-bars text-2xl"></i>
                </div>
                <Image src="/assets/refineveda_logo.webp" height={100} width={100} alt="logo" />
                <div className="w-170 h-10 bg-white rounded-full hidden gap-1 md:flex">
                    <i className="mt-3 ms-2 fa-solid fa-magnifying-glass text-stone-600"></i>
                    <input className="w-full text-black outline-none" placeholder="I am looking for...." />
                </div>
                <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 text-white">
                    <i className="fa-solid fa-cart-shopping"></i>
                    Cart
                    <p>{cartItems.length}</p>
                </button>
            </div>
            <nav className="hidden md:flex border-t border-white/20">
                <ul className="flex justify-left items-center gap-8 mt-4 ms-5">
                    <Link className="hover:text-orange-600 hover:underline cursor-pointer" href="/">Home</Link>
                    <Link className="hover:text-orange-600 hover:underline cursor-pointer" href="/shop">Shop</Link>
                    <li className="hover:text-orange-600 hover:underline cursor-pointer">💪HEALTH KITS💪</li>
                    <li className="hover:text-orange-600 hover:underline cursor-pointer">Migraine Kit</li>
                    <Link className="hover:text-orange-600 hover:underline cursor-pointer" href="/contactus">Contact Us</Link>
                </ul>
            </nav>
        {isCartOpen && (
        <CartModal cartItems={cartItems} onClose={() => setIsCartOpen(false)} />
        )}
        </header>

    )
}
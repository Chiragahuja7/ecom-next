'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CartModal from "./CartModal";
import { useCart } from "../Context/CartContext";
import SearchModal from "./SearchModal";

export default function Header(){
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const { addToCart, cartItems } = useCart();
    return(
        <header className="bg-[#0f5b3f] p-4">
            <div className="flex justify-between ms-5 mb-4">
                <div className="md:hidden">
                <i className="fa-solid fa-bars text-2xl"></i>
                </div>
                <Image src="/assets/refineveda_logo.webp" height={100} width={100} alt="logo" />
                                <div className="w-170 h-10 bg-white rounded-full hidden gap-1 md:flex items-center px-2">
                                        <i className="me-2 fa-solid fa-magnifying-glass text-stone-600"></i>
                                        <input
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    setIsSearchOpen(true);
                                                }
                                            }}
                                            className="w-full text-black outline-none"
                                            placeholder="I am looking for...."
                                        />
                                        <button onClick={() => { setIsSearchOpen(true); }} className="ms-2 text-sm text-gray-600"></button>
                                </div>
                <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 text-white">
                    <i className="fa-solid fa-cart-shopping"></i>
                    Cart
                    <p>({cartItems.length})</p>
                </button>
            </div>
            <nav className="hidden md:flex border-t border-white/20">
                <ul className="flex justify-left items-center gap-8 mt-4 ms-5">
                    <Link className="hover:text-orange-600 hover:underline cursor-pointer" href="/">Home</Link>
                    <Link className="hover:text-orange-600 hover:underline cursor-pointer" href="/shop">Shop</Link>
                    <Link className="hover:text-orange-600 hover:underline cursor-pointer" href="/shop/jeevan-amrit-complete-health-trio">💪HEALTH KITS💪</Link>
                    <Link className="hover:text-orange-600 hover:underline cursor-pointer" href="/shop/migraine-kit">Migraine Kit</Link>
                    <Link className="hover:text-orange-600 hover:underline cursor-pointer" href="/contactus">Contact Us</Link>
                </ul>
            </nav>
        {isCartOpen && (
        <CartModal cartItems={cartItems} onClose={() => setIsCartOpen(false)} />
        )}
        <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            searchQuery={searchText}
        />
        </header>

    )
}
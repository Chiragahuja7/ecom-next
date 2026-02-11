import Image from "next/image";
import Link from "next/link";

export default function Header(){
    return(
        <header className="bg-[#0f5b3f] p-5">
            <div className="flex justify-between mt-1 ms-5 mb-4">
                <div className="md:hidden">
                <i className="fa-solid fa-bars text-2xl"></i>
                </div>
                <Image src="/assets/refineveda_logo.webp" height={100} width={100} alt="logo" />
                <div className="w-170 h-10 bg-white rounded-full hidden gap-1 md:flex">
                    <i className="mt-3 ms-2 fa-solid fa-magnifying-glass text-stone-600"></i>
                    <input className="w-full text-black outline-none" placeholder="I am looking for...." />
                </div>
                <div>
                    <i className="fa-solid fa-cart-shopping"></i>
                    Cart
                </div>
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
        </header>
    )
}
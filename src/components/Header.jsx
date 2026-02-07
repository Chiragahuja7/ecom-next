import Image from "next/image";

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
            <nav className="hidden md:flex">
                <ul className="flex justify-left items-center gap-8 mt-4 ms-5">
                    <li className="hover:text-orange-600 hover:underline cursor-pointer">Home</li>
                    <li className="hover:text-orange-600 hover:underline cursor-pointer">Shop</li>
                    <li className="hover:text-orange-600 hover:underline cursor-pointer">💪HEALTH KITS💪</li>
                    <li className="hover:text-orange-600 hover:underline cursor-pointer">Migraine Kit</li>
                    <li className="hover:text-orange-600 hover:underline cursor-pointer">Contact Us</li>
                </ul>
            </nav>
        </header>
    )
}
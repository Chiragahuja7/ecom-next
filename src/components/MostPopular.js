'use client';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import {products} from "@/data/products"
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useState } from "react";
import ProductModal from "./ProductsModal";

export default function MostPopular(){
   const [selectedProduct, setSelectedProduct] = useState(null);

    return(
        <>
        <div className="p-6">
            <div className="p-4 flex justify-between items-center">
                <span className="text-black text-4xl font-bold">Most Popular Products</span>
                <div className="flex gap-4">
                    <span className="text-green-700 font-semibold">Most Popular</span>
                    <span className="text-gray-500">View All »</span>
                </div>
            </div>

            <div className="p-4 w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3">

            {products.slice(0,3).map((item)=>(
                <div key={item.id} className="min-w-full sm:min-w-[60%] md:min-w-0 bg-white rounded-2xl p-3">

                <Link href="" className="block overflow-hidden rounded-xl group relative">
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full z-10">
                        {item.discount}
                    </span>
                    <Image src={item.img} height={100} width={600} alt={item.name} className="rounded-xl transition-opacity duration-300 group-hover:opacity-0 ease-linear"/>
                    <Image src={item.hoverImg} height={100} width={600} alt="Hover" className="rounded-xl absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-linear"/>
                </Link>
                <h3 className="text-black font-semibold mt-3 text-center">{item.name}</h3>
                <div className="text-center mt-1">
                    <span className="text-green-700 font-bold">Rs. {item.price}.00</span>
                    <span className="text-gray-400 line-through ms-2"> Rs. {item.oldPrice}.00</span>
                </div>

                <button onClick={() => setSelectedProduct(item)}
                className="mt-4 border text-[#0f5b3f] font-bold hover:text-white border-gray-300 w-full py-2 rounded-full hover:bg-[#0f5b3f] transition">
                Add to Cart
                </button>
                </div>
            ))}
            </div>
            {selectedProduct && (
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
            )}
            </div>
        </div>
        </>
    )
}

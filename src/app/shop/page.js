'use client';
import Link from "next/link";
import { allproducts } from "@/data/products";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Shop(){
    const [products,setProducts] = useState([]);

    useEffect(()=>{
        const fetchProducts = async () => {
            try{
                const response = await fetch ("http://localhost:3000/api/products")

                if(!response.ok){
                    throw new Error("Failed to fetch products");
                }
                const data = await response.json();
                console.log("Fetched products:", data);
                if(data && Array.isArray(data)){
                    setProducts(data);
                }

            }catch(err){
                console.error("Error fetching products:", err);
            }
        }
        fetchProducts();
    },[])
    return(
        <>
        <div className="p-9 m-9 text-center">
            <Link href="/" className="text-gray-400">Home</Link>
            <span className="text-black"> : Shop</span>
            <div className="text-center mt-3">
            <span className="text-4xl text-black text-center font-bold">Shop</span>
            </div>
        </div> 
        <div>

            <div className="p-4 w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3">

            {products.map((item)=>{
                const primaryImg = (item && item.images && item.images.length > 0) ? item.images[0].url : '/assets/placeholder.png';
                const hoverImg = (item && item.images && item.images.length > 1) ? item.images[1].url : primaryImg;

                return (
                <div key={item._id} className="min-w-full sm:min-w-[60%] md:min-w-0 bg-white rounded-2xl p-3">

                <Link href="" className="block overflow-hidden rounded-xl group relative">
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full z-10">
                        {item.discount}
                    </span>
                    <Image src={primaryImg} height={100} width={300} alt={item.name} className="rounded-xl transition-opacity duration-300 group-hover:opacity-0 ease-linear"/>
                    <Image src={hoverImg} height={100} width={300} alt="Hover" className="rounded-xl absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-linear"/>
                </Link>
                <h3 className="text-black font-semibold mt-3 text-center">{item.name}</h3>
                <div className="text-center mt-1">
                    <span className="text-green-700 font-bold">Rs. {item.price}.00</span>
                    <span className="text-gray-400 line-through ms-2"> Rs. {item.oldPrice}.00</span>
                </div>

                <button className="mt-4 border text-[#0f5b3f] font-bold hover:text-white border-gray-300 w-full py-2 rounded-full hover:bg-[#0f5b3f] transition">
                    Add to Cart
                </button>
                </div>
            )})}
            </div>
            </div>
        </div>  
        </>
    )
}
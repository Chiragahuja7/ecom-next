"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function ProductModal({ product, onClose }) {
  const [variant, setVariant] = useState("500ml");
  const [qty, setQty] = useState(1);

  const isArrayImages = Array.isArray(product.images);
  const gallery = isArrayImages
    ? (product.images || []).map((it) => (typeof it === "string" ? it : it.url || it.secure_url))
    : (product.images && product.images[variant]) || [];

  function increaseQty() {
    setQty((prev) => prev + 1);
  }

  function decreaseQty() {
    if (qty === 1) return;
    setQty((prev) => prev - 1);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end md:items-center">

      <div className="bg-white w-full md:max-w-5xl rounded-t-3xl md:rounded-3xl grid md:grid-cols-2 p-4 md:p-6 relative">

        <button onClick={onClose} className="absolute right-4 top-4 text-xl text-black">✕</button>
        <div>

          <Swiper
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="rounded-2xl"
          >
            {gallery.map((img, i) => (
              <SwiperSlide key={i}>
                <Image src={img} width={400} height={500} alt="product" className="rounded-2xl mx-auto"/>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-4 md:mt-0 md:pl-6">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            {product.discount}
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2 text-black">
            {product.name}
          </h2>
          <div className="mt-2">
            <span className="text-green-700 text-xl font-bold">
              Rs. {product.price}.00
            </span>
            <span className="line-through text-gray-400 ml-2">
              Rs. {product.oldPrice}.00
            </span>
          </div>
          <p className="text-gray-500 mt-2">
            Weight: <b>{variant}</b>
          </p>

          {!isArrayImages && (
            <div className="flex gap-2 mt-3">
              {Object.keys(product.images).map((v) => (
                <button key={v} onClick={() => setVariant(v)}
                  className={`border px-3 py-2 rounded-lg text-sm text-black ${variant === v? "bg-black text-white": ""}`}>
                  {v}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-5">

            <div className="flex items-center border rounded-full px-4 py-2 text-black">
              <button onClick={decreaseQty}>−</button>
              <span className="mx-3">{qty}</span>
              <button onClick={increaseQty}>+</button>
            </div>

            <button className="bg-gray-800 text-white px-6 py-2 rounded-full">
              Add to Cart
            </button>
          </div>

          <button className="bg-green-700 text-white w-full py-3 rounded-full mt-4">
            Buy it now
          </button>

          <p className="mt-4 text-sm underline cursor-pointer text-black">
            View Full Details »
          </p>
        </div>
      </div>
    </div>
  );
}

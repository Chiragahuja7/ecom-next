'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const {slug} = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity , setQuantity]=useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
  if (!slug) return;
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      const data = await res.json();
      setProduct(data.product);

      if (data.product.sizes?.length > 0) {
        setSelectedSize(data.product.sizes[0]);
      }

    } catch (err) {
      setError(err.message || 'Error fetching product');
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [slug]);

  if (loading) return <div className="p-9 m-9">Loading...</div>;
  if (error) return <div className="p-9 m-9 text-red-600">Error: {error}</div>;
  if (!product) return <div className="p-9 m-9">Product not found</div>;

  function increaseQty(){
    setQuantity(prev => prev + 1);
  }

  function decreaseQty(){
    setQuantity(prev => prev - 1);
  }

  return (
    <div>
      <div className="flex p-9 m-9 justify-center gap-40">
        <div className="flex justify-center mt-6">
        {selectedSize?.image?.url ? (
          <img
            src={selectedSize.image.url}
            alt={product.name}
            className="w-80 rounded-lg"
          />
        ) : (
          product.images?.length > 0 && (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-80 rounded-lg"
            />
          )
        )}
      </div>
        <div className="text-black font-bold">
          <span className="text-gray-700">Refineveda</span>
          <h1 className="text-3xl">{product.name}</h1>
          <div className="flex">
            <p className="text-green-700 text-2xl mt-3">
              Rs. {selectedSize?.price}.00
            </p>
            <p className="ms-3 text-xl line-through text-gray-400 mt-3.5">
              Rs. {selectedSize?.oldPrice}.00
            </p>
          </div>

          <div className="mt-4">
            <span className="me-3">Size:</span>

            {product.sizes?.map((item, index) => (
              <label key={index} className="ms-2 cursor-pointer">
                <input
                  type="radio"
                  name="size"
                  className="hidden"
                  checked={selectedSize?.size === item.size}
                  onChange={() => setSelectedSize(item)}
                />

                <span
                  className={`px-4 py-2 border rounded 
                  ${
                    selectedSize?.size === item.size
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {item.size}
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-5">
            <div className="flex items-center border rounded-full px-10 py-3 text-black">
              <button onClick={decreaseQty}>−</button>
              <span className="mx-3">{quantity}</span>
              <button onClick={increaseQty}>+</button>
            </div>

            <button className="bg-gray-800 text-white px-40 py-3 rounded-full">Add to Cart</button>
          </div>
          <button className="bg-green-900 mt-2 text-white px-60 py-4 rounded-full">Buy It Now</button>
        </div>
      </div>
    </div>
  );
}
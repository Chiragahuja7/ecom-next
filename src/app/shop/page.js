"use client";
import Link from "next/link";
import { allproducts, categories } from "@/data/products";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductModal from "@/src/components/ProductsModal";

export default function Shop(){
    const [products,setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    const [minPriceState, setMinPriceState] = useState("");
    const [maxPriceState, setMaxPriceState] = useState("");
    const [rangeState, setRangeState] = useState(1000);
    const [inStockChecked, setInStockChecked] = useState(false);
    const [outOfStockChecked, setOutOfStockChecked] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [pageState, setPageState] = useState(1);
    const [pagesState, setPagesState] = useState(1);
    const [totalState, setTotalState] = useState(0);

    useEffect(() => {
        const spMin = searchParams?.get("minPrice") || "";
        const spMax = searchParams?.get("maxPrice") || "";
        const spRange = searchParams?.get("priceRange") || spMax || "1000";
        const inStockParam = searchParams?.get("inStock");

        const spPage = searchParams?.get("page") || "1";

        setMinPriceState(spMin);
        setMaxPriceState(spMax);
        setRangeState(Number(spRange));
        setInStockChecked(inStockParam === "true");
        setOutOfStockChecked(inStockParam === "false");
        setPageState(Number(spPage));
    }, [searchParams]);

    const updateQuery = (updates = {}) => {
        const params = new URLSearchParams(Object.fromEntries(searchParams?.entries() || []));
        Object.keys(updates).forEach((k) => {
            const v = updates[k];
            if (v === null || v === "" || v === undefined) params.delete(k);
            else params.set(k, String(v));
        });
        if (!updates.hasOwnProperty("page")) params.set("page", "1");
        const qs = params.toString();
        router.push(`/shop${qs ? `?${qs}` : ""}`);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams();
                const category = searchParams?.get("category");
                const inStock = searchParams?.get("inStock");
                const minPrice = searchParams?.get("minPrice");
                const maxPrice = searchParams?.get("maxPrice");
                const page = searchParams?.get("page") || "1";
                const limit = searchParams?.get("limit") || "6";

                if (category) params.set("category", category);
                if (inStock) params.set("inStock", inStock);
                if (minPrice) params.set("minPrice", minPrice);
                if (maxPrice) params.set("maxPrice", maxPrice);
                params.set("page", page);
                params.set("limit", limit);

                const url = `/api/products?${params.toString()}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                console.log("Fetched products:", data);

                if (data && data.success && Array.isArray(data.products)) {
                    setProducts(data.products);
                    setPageState(Number(data.page) || Number(page));
                    setPagesState(Number(data.pages) || 1);
                    setTotalState(Number(data.total) || 0);
                } else if (Array.isArray(data)) {
                    setProducts(data);
                    setPageState(Number(page));
                    setPagesState(1);
                    setTotalState(data.length || 0);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, [searchParams]);
    return(
        <>
        <div className="p-9 m-9 text-center">
            <Link href="/" className="text-gray-400">Home</Link>
            <span className="text-black"> : Shop</span>
            <div className="flex items-center justify-center mt-3 gap-3">
            <span className="text-4xl text-black text-center font-bold">Shop</span>
            <button onClick={()=>setShowFilters(true)} className="md:hidden px-3 py-1 rounded bg-gray-200 text-sm">Filters</button>
            </div>
        </div> 
        <div className="flex text-black p-2 relative">
            {showFilters && (
                <div onClick={()=>setShowFilters(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />
            )}

            <div className={`${showFilters ? 'fixed left-0 top-0 z-50 h-full w-3/4 bg-white p-5' : 'hidden'} md:block md:w-64 md:relative md:h-auto md:top-auto md:left-auto md:z-auto md:bg-transparent md:p-5 mt-5`}>
                <div>
                    <details className="group" open>
                            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-gray-900">
                            <span>Shop by Concern</span>
                            <span className="group-open:hidden text-2xl">+</span>
                            <span className="hidden group-open:block text-2xl">-</span>
                            </summary>
                            
                            <div className="group-open:animate-fadeIn mt-3 text-gray-600">
                            {categories.map((category ,index)=>{
                                return(
                                <Link key={index} href={`/shop?category=${encodeURIComponent(category)}`} className="block py-2 px-3 rounded hover:bg-gray-200">
                                    {category}
                                </Link>
                                )
                            })}
                            </div>
                        </details>
                </div>

                <div className="mt-6">
                    <details className="group " open>
                            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-gray-900">
                            <span>Availability</span>
                            <span className="group-open:hidden text-2xl">+</span>
                            <span className="hidden group-open:block text-2xl">-</span>
                            </summary>
                            
                            <div className="flex flex-col group-open:animate-fadeIn mt-3 text-gray-600">
                            <div>
                            <input type="checkbox" id="inStock" name="inStock" className="mr-2" checked={inStockChecked} onChange={(e)=>{
                                const checked = e.target.checked;
                                setInStockChecked(checked);
                                if (checked) {
                                    setOutOfStockChecked(false);
                                    updateQuery({ inStock: "true" });
                                } else {
                                    if (outOfStockChecked) updateQuery({ inStock: "false" });
                                    else updateQuery({ inStock: null });
                                }
                            }}/>
                            <label htmlFor="inStock">In Stock</label>
                            </div>
                            <div>
                            <input type="checkbox" id="outOfStock" name="outOfStock" className="mr-2" checked={outOfStockChecked} onChange={(e)=>{
                                const checked = e.target.checked;
                                setOutOfStockChecked(checked);
                                if (checked) {
                                    setInStockChecked(false);
                                    updateQuery({ inStock: "false" });
                                } else {
                                    if (inStockChecked) updateQuery({ inStock: "true" });
                                    else updateQuery({ inStock: null });
                                }
                            }}/>
                            <label htmlFor="outOfStock">Out Of Stock</label>
                            </div>
                            </div>
                        </details>
                </div>

                <div className="mt-6">
                    <details className="group " open>
                            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-gray-900">
                            <span>Price</span>
                            <span className="group-open:hidden text-2xl">+</span>
                            <span className="hidden group-open:block text-2xl">-</span>
                            </summary>
                            
                            <div className="flex flex-col group-open:animate-fadeIn mt-3 text-gray-600">
                            <p>INR</p>
                            <div className="flex items-center">
                                <div>
                                <input type="number" id="minPrice" name="minPrice" value={minPriceState} onChange={(e)=>{
                                    const v = e.target.value;
                                    setMinPriceState(v);
                                    updateQuery({ minPrice: v || null });
                                }} className="border w-20 border-gray-300 rounded py-1"/>
                                </div>
                                <p className="mx-3">_</p>
                                <div>
                            <input type="number" id="maxPrice" name="maxPrice" value={maxPriceState} onChange={(e)=>{
                                    const v = e.target.value;
                                    setMaxPriceState(v);
                                    updateQuery({ maxPrice: v || null });
                                }} className=" border w-20 border-gray-300 rounded py-1"/>
                                </div>
                            </div>
                            <div>
                            <input type="range" name="priceRange" id="priceRange" min="0" max="1000" value={rangeState} onChange={(e)=>{
                                const v = e.target.value;
                                setRangeState(Number(v));
                                setMaxPriceState(String(v));
                                updateQuery({ priceRange: v, maxPrice: v });
                            }} className="w-full bg-black mt-3"/>
                            </div>
                            </div>
                        </details>
                </div>

                <div className="mt-6">
                    <details className="group " open>
                            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-gray-900">
                            <span>Price</span>
                            <span className="group-open:hidden text-2xl">+</span>
                            <span className="hidden group-open:block text-2xl">-</span>
                            </summary>
                            
                            
                            
                        </details>
                </div>
                
              </div>

            <div className="p-4 w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3">

            {products.map((item)=>{
                const primaryImg = (item && item.images && item.images.length > 0) ? item.images[0].url : '/assets/placeholder.png';
                const hoverImg = (item && item.images && item.images.length > 1) ? item.images[1].url : primaryImg;

                return (
                <div key={item._id} className="min-w-full sm:min-w-[60%] md:min-w-0 bg-white rounded-2xl p-3">

                <Link href={`/shop/${item.slug}`} className="block overflow-hidden rounded-xl group relative">
                    {/* <span className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full z-10">
                        {item.discount}
                    </span> */}
                    <Image src={primaryImg} height={100} width={300} alt={item.name} className="rounded-xl transition-opacity duration-300 group-hover:opacity-0 ease-linear w-full h-65 md:h-90"/>
                    <Image src={hoverImg} height={100} width={300} alt="Hover" className="rounded-xl absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-linear w-full h-65 md:h-90"/>
                </Link>
                <h3 className="text-black font-semibold mt-3 text-center">{item.name}</h3>
                <div className="text-center mt-1">
                    <span className="text-green-700 font-bold">Rs.{item.sizes?.[0]?.price}.00</span>
                    <span className="text-gray-400 line-through ms-2"> Rs.{item.sizes?.[0]?.oldPrice}.00</span>
                </div>

                <button className="mt-4 border text-[#0f5b3f] font-bold hover:text-white border-gray-300 w-full py-2 rounded-full hover:bg-[#0f5b3f] transition" onClick={() => setSelectedProduct(item)}>
                    Add to Cart
                </button>
                </div>
            )})}

            </div>
            
            <div className="flex items-center justify-center gap-2 mt-6">
                <button
                    onClick={() => updateQuery({ page: 1 })}
                    disabled={pageState <= 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    First
                </button>
                <button
                    onClick={() => updateQuery({ page: Math.max(1, pageState - 1) })}
                    disabled={pageState <= 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="px-3">{pageState} of {pagesState}</span>

                <button
                    onClick={() => updateQuery({ page: Math.min(pagesState, pageState + 1) })}
                    disabled={pageState >= pagesState}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
                <button
                    onClick={() => updateQuery({ page: pagesState })}
                    disabled={pageState >= pagesState}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Last
                </button>
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
'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SearchModal({ isOpen, onClose, searchQuery }) {
  const [show, setShow] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchResults() {
      if (!isOpen) return;
      if (!searchQuery || searchQuery.trim() === "") {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await res.json();
        if (data && data.products) setResults(data.products);
        else setResults([]);
      } catch (e) {
        setResults([]);
      }
      setLoading(false);
    }
    fetchResults();
  }, [isOpen, searchQuery]);
  
  useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen]);


  if (!isOpen) return null;

  return (
    <div  className="fixed inset-0 z-50" onClick={onClose}>

      <div onClick={(e) => e.stopPropagation()} className={`absolute top-16 left-0 w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${show ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-black">Search results for "{searchQuery}"</div>
            <button onClick={onClose} className="text-xl font-bold text-black">✕</button>
          </div>

          <div className="mt-4 text-black">
            {loading && <div>Loading...</div>}
            {!loading && results.length === 0 && (
              <div className="text-sm text-gray-500 ">No results</div>
            )}

            {!loading && results.length > 0 && (
              <div className="mt-3 overflow-x-auto text-black">
                <div className="flex gap-4">
                  {results.map((p) => (
                    <Link onClick={() => onClose()} href={`/shop/${ p.slug}`} key={p._id || p.id} className="w-48 shrink-0 bg-white border border-gray-300 rounded p-2 ">
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={p.img || p.images?.[0].url || p.hoverImg} alt={p.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="mt-2 text-sm font-medium">{p.name}</div>
                      <div className="text-sm text-green-700">₹{p.sizes?.[0]?.price || ""}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

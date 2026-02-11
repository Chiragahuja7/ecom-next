"use client";

import { useEffect, useState } from "react";

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
      name: "",
      slug: "",
      description: "",
      price: "",
      oldPrice:"",
      images: [],
      category: "",
      stock: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    }

    async function handleFiles(e) {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      setLoading(true);
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      const uploads = data?.uploads || [];
      setForm((s) => ({ ...s, images: [...(s.images || []), ...uploads] }));
      setLoading(false);
    }

    function removeImage(index) {
      setForm((s) => ({ ...s, images: (s.images || []).filter((_, i) => i !== index) }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
          setLoading(true);
          try {
            const payload = {
              ...form,
              price: form.price === "" ? undefined : parseFloat(form.price),
              oldPrice: form.oldPrice === "" ? undefined : parseFloat(form.oldPrice),
              images: Array.isArray(form.images) ? form.images : [],
              stock: form.stock === "" ? undefined : parseInt(form.stock) || 0,
            };

            const method = editingId ? "PUT" : "POST";
            const body = editingId ? JSON.stringify({ id: editingId, ...payload }) : JSON.stringify(payload);

            const res = await fetch("/api/products", {
              method,
              headers: { "Content-Type": "application/json" },
              body,
            });

            const result = await res.json();
            console.log("/api/products response:", result);

            if (!result || result.success === false) {
              const msg = (result && result.error) || "Unknown error adding product";
              alert("Failed to save product: " + msg);
              setLoading(false);
              return;
            }

            setForm({ name: "", slug: "", description: "", price: "", oldPrice: "", images: [], category: "", stock: "" });
            setEditingId(null);
            fetchProducts();
          } catch (err) {
            console.error(err);
            alert("Error submitting product: " + (err.message || err));
          } finally {
            setLoading(false);
          }

        if (editingId) {
            await fetch("/api/products", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingId, ...payload }),
            });
        } else {
            await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }

        setForm({ name: "", slug: "", description: "", price: "", oldPrice: "", images: [], category: "", stock: "" });
        setEditingId(null);
        fetchProducts();
    }

    async function handleEdit(p) {
      setEditingId(p._id);
      const imgs = (p.images || []).map((it) => {
        if (!it) return null;
        if (typeof it === "string") return { url: it, public_id: null };
        return { url: it.url || it.secure_url || null, public_id: it.public_id || null };
      }).filter(Boolean);
      setForm({
        name: p.name || "",
        slug: p.slug || "",
        description: p.description || "",
        price: p.price ?? "",
        oldPrice: p.oldPrice ?? "",
        images: imgs,
        category: p.category || "",
        stock: p.stock ?? "",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        if (!confirm("Delete this product?")) return;
        await fetch("/api/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        fetchProducts();
    }

    return (
  <div className="p-6 md:p-10 bg-gray-100 min-h-screen text-black">

    <h1 className="text-3xl font-bold mb-6">
      Admin Panel
    </h1>

    <div className="bg-white rounded-2xl shadow-md p-6 mb-10">

      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Product" : "Add Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        <div>
          <label className="font-medium">
            Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">
            Slug
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">
            Price
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">
           Old Price
          </label>
          <input
            name="oldPrice"
            type="number"
            step="0.01"
            value={form.oldPrice}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">
            Stock
          </label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">
            Category
          </label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="font-medium">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFiles}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />

          <div className="flex gap-3 flex-wrap mt-3">
            {(form.images || []).map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img.url} alt={`img-${idx}`} className="w-24 h-24 object-cover rounded" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute right-0 top-0 bg-white rounded-full px-2">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div className="md:col-span-2 flex gap-3 mt-4">

          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  slug: "",
                  description: "",
                  price: "",
                  oldPrice: "",
                  images: [],
                  category: "",
                  stock: "",
                });
              }}
              className="border px-6 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>

    <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">

      <h2 className="text-xl font-semibold mb-4">
        Products
      </h2>

      {loading ? (<div>Loading...</div>) : (
        <table className="w-full border border-gray-300">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Slug</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Old Price</th>
              <th className="p-3 border">Stock</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className="text-center hover:bg-gray-50"
              >
                <td className="p-3 border">{p.name}</td>
                <td className="p-3 border">{p.slug}</td>
                <td className="p-3 border">
                  ₹ {p.price}
                </td>
                <td className="p-3 border">
                  ₹ {p.oldPrice}
                </td>
                <td className="p-3 border">{p.stock}</td>
                <td className="p-3 border">
                  {p.category}
                </td>

                <td className="p-3 border">

                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg ml-2 hover:bg-red-700 transition"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);
}
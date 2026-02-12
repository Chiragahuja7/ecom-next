import connectDB from "@/src/lib/mongodb";
import Product from "@/src/models/Product";
import cloudinary from "@/src/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("/api/products POST body:", body);

    if (body.price !== undefined) body.price = Number(body.price);
    if (body.oldPrice !== undefined) body.oldPrice = Number(body.oldPrice);
      if (Array.isArray(body.sizes)) {
        body.sizes = body.sizes.map((sz) => ({
          size: sz.size,
          price: sz.price !== undefined && sz.price !== null ? Number(sz.price) : undefined,
          oldPrice: sz.oldPrice !== undefined && sz.oldPrice !== null ? Number(sz.oldPrice) : undefined,
          image: sz.image || null,
        }));
      }

    const product = await Product.create(body);

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json(products);
}

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("/api/products PUT body:", body);
    const { id, slug, ...update } = body;

    if (!id && !slug) {
      return NextResponse.json({ success: false, error: "Provide id or slug to update" });
    }
    let product;
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.oldPrice !== undefined) update.oldPrice = Number(update.oldPrice);
    if (Array.isArray(update.sizes)) {
      update.sizes = update.sizes.map((sz) => ({
        size: sz.size,
        price: sz.price !== undefined && sz.price !== null ? Number(sz.price) : undefined,
        oldPrice: sz.oldPrice !== undefined && sz.oldPrice !== null ? Number(sz.oldPrice) : undefined,
        image: sz.image || null,
      }));
    }

    if (id) {
      product = await Product.findByIdAndUpdate(id, update, { new: true });
    } else {
      product = await Product.findOneAndUpdate({ slug }, update, { new: true });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, slug } = body;

    if (!id && !slug) {
      return NextResponse.json({ success: false, error: "Provide id or slug to delete" });
    }
    let product;
    if (id) product = await Product.findById(id);
    else product = await Product.findOne({ slug });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" });
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) => {
          if (img && img.public_id) {
            return new Promise((resolve) => {
              cloudinary.uploader.destroy(img.public_id, () => resolve(true));
            });
          }
          return Promise.resolve(true);
        })
      );
    }

    if (id) await Product.findByIdAndDelete(id);
    else await Product.findOneAndDelete({ slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
import connectDB from "@/src/lib/mongodb";
import Product from "@/src/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

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
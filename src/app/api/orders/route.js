import connectDB from "@/src/lib/mongodb";
import Order from "@/src/models/Order";

export async function POST(req) {
  try {
    await connectDB();

    const contentType = req.headers.get("content-type") || "";
    let body;

    if (contentType.includes("multipart/form-data") && typeof req.formData === "function") {
      const formData = await req.formData();
      body = {
        customerName: formData.get("customerName"),
        email: formData.get("email"),
        phone: formData.get("phone") || "",
        pincode: formData.get("pincode"),
        address: formData.get("address"),
        items: formData.get("items") ? JSON.parse(formData.get("items")) : [],
        totalAmount: formData.get("totalAmount") ? Number(formData.get("totalAmount")) : 0,
        paymentStatus: formData.get("paymentStatus") || undefined,
      };
    } else {
      body = await req.json();
    }

    const { customerName, email, phone = "", pincode, address, items, totalAmount, paymentStatus } = body;

    if (!customerName || !address || !items || !items.length || !totalAmount) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newOrder = await Order.create({
      customerName,
      phone,
      email,
      pincode,
      address,
      items,
      totalAmount,
      paymentStatus: paymentStatus || undefined,
    });

    return Response.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

import Link from "next/link";

export default function CartPage(){
    return(
        <>
        <div className="p-9 m-9 text-center text-black">
            <Link href="/" className="text-gray-400">Home</Link>
            <span className=""> : Shopping Cart</span>
            <div className="text-center mt-3">
            <span className="text-4xl text-center font-bold">Shopping Cart</span>
            <p className="mt-2 text-gray-500">Review your selected items before purchase. Enjoy a seamless shopping experience!</p>
            </div>
        </div> 
<div className="flex justify-center">
        <table className="text-black">
            <thead className="flex">
                <tr>
                    <th className="text-left p-4">Product</th>
                </tr>
                <tr>
                    <th className="text-left p-4">Price</th>
                </tr>
                <tr>
                    <th className="text-left p-4">Quantity</th>
                </tr>
                <tr>
                    <th className="text-left p-4">Total</th>
                </tr>
            </thead>
            <tbody>
                <td>
                    <div className="flex items-center gap-4">
                        <img src="/assets/placeholder.png" alt="Product Image" className="w-25 h-30 object-cover rounded"/>
                        <div>
                            <h3 className="font-semibold">Product Name</h3>
                            <p className="text-sm text-gray-500">Size: M</p>
                        </div>
                    </div>
                </td>
                <td>
                    <p className="text-green-800 font-bold">Rs.499</p>
                </td>
            </tbody>
        </table>
        <div>
            <div className="bg-gray-100 p-6 h-40 w-80">
                
            </div>
        </div>
</div>

        </>
    )
}
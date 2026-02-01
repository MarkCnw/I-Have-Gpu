// app/admin/products/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteProductBtn from '@/components/DeleteProductBtn' 

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Manage Products</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-lg shadow-black/10 flex items-center gap-2"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase font-semibold border-b border-neutral-200">
            <tr>
              <th className="p-4 pl-6">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-center">Stock</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50 transition group">
                <td className="p-4 pl-6">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg border border-neutral-200 p-1">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />}
                  </div>
                </td>
                <td className="p-4 font-medium text-neutral-900">{p.name}</td>
                <td className="p-4"><span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded text-xs border border-neutral-200">{p.category}</span></td>
                <td className="p-4 text-right font-mono text-neutral-900">฿{Number(p.price).toLocaleString()}</td>
                <td className="p-4 text-center text-neutral-500">{p.stock}</td>
                
                <td className="p-4 pr-6 text-right opacity-50 group-hover:opacity-100 transition">
                  <DeleteProductBtn id={p.id} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
               <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-400">No products found.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
// app/admin/products/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteProductBtn from '@/components/DeleteProductBtn' // 👈 Import ปุ่มลบที่เราสร้างไว้

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 Manage Products</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950 text-slate-400 text-sm uppercase">
            <tr>
              <th className="p-4 border-b border-slate-800">Image</th>
              <th className="p-4 border-b border-slate-800">Name</th>
              <th className="p-4 border-b border-slate-800">Category</th>
              <th className="p-4 border-b border-slate-800 text-right">Price</th>
              <th className="p-4 border-b border-slate-800 text-center">Stock</th>
              {/* 🔥 เพิ่มหัวตาราง Actions */}
              <th className="p-4 border-b border-slate-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/50 transition border-b border-slate-800 last:border-0">
                <td className="p-4">
                  <div className="w-12 h-12 bg-white rounded overflow-hidden">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-contain" />}
                  </div>
                </td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4"><span className="bg-slate-800 px-2 py-1 rounded text-xs">{p.category}</span></td>
                <td className="p-4 text-right font-mono text-emerald-400">฿{Number(p.price).toLocaleString()}</td>
                <td className="p-4 text-center">{p.stock}</td>
                
                {/* 🔥 เพิ่มปุ่มลบสินค้าตรงนี้ */}
                <td className="p-4 text-right">
                  <DeleteProductBtn id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* กรณีไม่มีสินค้าเลย */}
        {products.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            ยังไม่มีสินค้าในระบบ
          </div>
        )}
      </div>
    </div>
  )
}
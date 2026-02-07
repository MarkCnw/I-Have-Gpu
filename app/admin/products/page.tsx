// app/admin/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Package } from 'lucide-react'
import Link from 'next/link'
import DeleteProductBtn from '@/components/DeleteProductBtn'

export default function AdminProductsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการสินค้า (Inventory)</h1>
          <p className="text-slate-500 text-sm">สินค้าทั้งหมด {products.length} รายการ</p>
        </div>
        <Link href="/admin/products/new" className="bg-black text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-neutral-800 transition shadow-lg">
          <Plus size={18} /> เพิ่มสินค้าใหม่
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm">
        <Search className="text-slate-400 ml-2" size={20} />
        <input 
          placeholder="ค้นหาชื่อสินค้า..." 
          className="w-full p-2 outline-none text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4 w-[80px]">รูปภาพ</th>
              <th className="p-4">ชื่อสินค้า</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">สต็อก</th>
              <th className="p-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {filtered.map((product: any) => (
              <tr key={product.id} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="text-slate-300" size={20} />
                    )}
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-800">{product.name}</td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{product.category}</span>
                </td>
                <td className="p-4 font-mono font-bold">฿{product.price.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {product.stock} ชิ้น
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* ✅ แก้ไขตรงนี้: เปลี่ยนปุ่มเป็น Link ไปหน้าแก้ไข */}
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center justify-center" 
                      title="แก้ไข"
                    >
                      <Edit size={18} />
                    </Link>
                    <DeleteProductBtn id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
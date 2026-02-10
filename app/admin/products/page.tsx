// app/admin/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Package } from 'lucide-react'
import Link from 'next/link'
import DeleteProductBtn from '@/components/DeleteProductBtn'

// ✅ ส่วนเดิม: Component ย่อยเพื่อจัดการ Skeleton Loading ของรูปภาพแยกแต่ละรายการ
const ProductImageCell = ({ src, alt }: { src?: string, alt: string }) => {
  const [isLoading, setIsLoading] = useState(true)

  if (!src) {
    return (
      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
        <Package className="text-slate-300" size={20} />
      </div>
    )
  }

  return (
    <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-10" />
      )}
      <img 
        src={src} 
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)} 
      />
    </div>
  )
}

// ✅ ส่วนที่เพิ่ม: Component สำหรับ Skeleton Loading ของแถวในตาราง
const TableRowSkeleton = () => (
  <tr className="border-b border-slate-100">
    <td className="p-4"><div className="w-12 h-12 bg-slate-200 rounded-lg animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-48 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" /></td>
    <td className="p-4 text-right"><div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse ml-auto" /></td>
  </tr>
)

export default function AdminProductsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true) // ✅ เพิ่ม state สำหรับเช็คสถานะการโหลดข้อมูล

  useEffect(() => {
    setIsLoading(true) // เริ่มโหลดข้อมูล
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setIsLoading(false) // โหลดเสร็จสิ้น
      })
      .catch(() => setIsLoading(false))
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการสินค้า (Inventory)</h1>
          {/* ✅ เพิ่ม Skeleton Loading สำหรับข้อความแสดงจำนวนรายการ */}
          <p className="text-slate-500 text-sm">
            {isLoading ? (
              <span className="inline-block w-24 h-4 bg-slate-200 rounded animate-pulse" />
            ) : (
              `สินค้าทั้งหมด ${products.length} รายการ`
            )}
          </p>
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
            {/* ✅ แสดง Skeleton Rows ขณะที่ isLoading เป็น true */}
            {isLoading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : filtered.length > 0 ? (
              filtered.map((product: any) => (
                <tr key={product.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <ProductImageCell src={product.image} alt={product.name} />
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
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  ไม่พบสินค้าที่ค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
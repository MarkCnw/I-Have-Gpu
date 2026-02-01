// app/admin/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Edit2, Save, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempStock, setTempStock] = useState<number>(0)
  const [selectedIds, setSelectedIds] = useState<string[]>([]) // For Bulk Actions

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])

  // Inline Edit Logic
  const startEdit = (product: any) => {
    setEditingId(product.id)
    setTempStock(product.stock)
  }

  const saveStock = async (id: string) => {
    try {
      // Optimistic Update (อัปเดตหน้าจอทันทีเพื่อให้รู้สึกลื่น)
      setProducts(products.map(p => p.id === id ? { ...p, stock: tempStock } : p))
      setEditingId(null)
      
      // Send API Request
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: tempStock })
      })
      toast.success('Stock updated!')
    } catch (e) {
      toast.error('Failed to update stock')
      // Revert if failed logic here...
    }
  }

  // Bulk Action Logic
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Inventory</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="p-4 w-10"><input type="checkbox" onChange={(e) => {
                if(e.target.checked) setSelectedIds(products.map(p => p.id))
                else setSelectedIds([])
              }} /></th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 w-32">Stock (Inline Edit)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4"><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-slate-500">{p.category}</td>
                <td className="p-4 font-mono">฿{p.price.toLocaleString()}</td>
                
                {/* Inline Edit Cell */}
                <td className="p-4">
                  {editingId === p.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={tempStock} 
                        onChange={(e) => setTempStock(Number(e.target.value))}
                        className="w-16 p-1 border rounded text-center font-bold"
                        autoFocus
                      />
                      <button onClick={() => saveStock(p.id)} className="text-green-600 hover:bg-green-100 p-1 rounded"><Save size={16}/></button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => startEdit(p)} 
                      className="cursor-pointer hover:bg-slate-100 px-2 py-1 rounded flex items-center justify-between group border border-transparent hover:border-slate-200"
                    >
                      <span className={`font-bold ${p.stock < 5 ? 'text-red-500' : 'text-slate-700'}`}>{p.stock}</span>
                      <Edit2 size={12} className="opacity-0 group-hover:opacity-100 text-slate-400" />
                    </div>
                  )}
                </td>

                <td className="p-4 text-right">
                  <button className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Action Bar for Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
           <span className="font-bold">{selectedIds.length} items selected</span>
           <div className="h-4 w-px bg-slate-700"></div>
           <button className="hover:text-red-400 font-medium text-sm">Delete Selected</button>
           <button className="hover:text-indigo-400 font-medium text-sm">Set Out of Stock</button>
        </div>
      )}
    </>
  )
}
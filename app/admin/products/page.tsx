// app/admin/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Package } from 'lucide-react'
import Link from 'next/link'
import DeleteProductBtn from '@/components/DeleteProductBtn'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

const ProductImageCell = ({ src, alt }: { src?: string, alt: string }) => {
  const [isLoading, setIsLoading] = useState(true)

  if (!src) {
    return (
      <div className="w-12 h-12 bg-slate-100 dark:bg-surface-bg rounded-lg overflow-hidden border border-slate-200 dark:border-border-main flex items-center justify-center">
        <Package className="text-slate-400 dark:text-txt-muted" size={20} />
      </div>
    )
  }

  return (
    <div className="relative w-12 h-12 bg-slate-100 dark:bg-surface-bg rounded-lg overflow-hidden border border-slate-200 dark:border-border-main flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 bg-skeleton-light animate-pulse z-10" />
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

const TableRowSkeleton = () => (
  <tr className="border-b border-slate-100 dark:border-border-main">
    <td className="p-4"><div className="w-12 h-12 bg-skeleton rounded-lg animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-48 bg-skeleton rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-6 w-20 bg-skeleton-light rounded-full animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-24 bg-skeleton rounded animate-pulse" /></td>
    <td className="p-4"><div className="h-4 w-16 bg-skeleton-light rounded animate-pulse" /></td>
    <td className="p-4 text-right"><div className="h-8 w-20 bg-skeleton rounded-lg animate-pulse ml-auto" /></td>
  </tr>
)

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { locale } = useLanguageStore()

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data); setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-foreground">{t('admin.manageProducts', locale)}</h1>
          <p className="text-slate-500 dark:text-txt-muted text-sm">
            {isLoading ? (
              <span className="inline-block w-24 h-4 bg-skeleton-light rounded animate-pulse" />
            ) : (
              `${t('admin.allProducts', locale)} ${products.length} ${t('admin.items', locale)}`
            )}
          </p>
        </div>
        <Link href="/admin/products/new" className="bg-black text-white dark:bg-foreground dark:text-surface-card px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-slate-200 dark:shadow-none">
          <Plus size={18} /> {t('admin.addProduct', locale)}
        </Link>
      </div>

      <div className="bg-white dark:bg-surface-card p-2 rounded-xl border border-slate-200 dark:border-border-main flex items-center gap-2 shadow-sm">
        <Search className="text-slate-400 dark:text-txt-muted ml-2" size={20} />
        <input
          placeholder={t('admin.searchProducts', locale)}
          className="w-full p-2 outline-none text-sm bg-transparent text-slate-800 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-txt-muted"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-surface-card rounded-xl border border-slate-200 dark:border-border-main shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-surface-bg text-slate-500 dark:text-txt-muted font-bold border-b border-slate-200 dark:border-border-main">
              <tr>
                <th className="p-4 w-[80px]">{t('admin.image', locale)}</th>
                <th className="p-4">{t('admin.productName', locale)}</th>
                <th className="p-4">{t('admin.category', locale)}</th>
                <th className="p-4">{t('admin.price', locale)}</th>
                <th className="p-4">{t('admin.stock', locale)}</th>
                <th className="p-4 text-right">{t('admin.manage', locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-main">
              {isLoading ? (
                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
              ) : filtered.length > 0 ? (
                filtered.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-surface-bg transition-colors">
                    <td className="p-4">
                      <ProductImageCell src={product.image} alt={product.name} />
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-foreground">{product.name}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 dark:bg-surface-bg text-slate-600 dark:text-txt-muted px-2 py-1 rounded text-[10px] font-bold uppercase border border-slate-200 dark:border-border-main">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-foreground">฿{product.price.toLocaleString()}</td>
                    <td className="p-4">
                      {/* ✅ เอาพื้นหลังสีออกแล้ว เหลือแค่สีตัวอักษรให้อ่านง่ายขึ้น */}
                      <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {product.stock} {t('admin.pieces', locale)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                          title="Edit"
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
                  <td colSpan={6} className="p-8 text-center text-slate-400 dark:text-txt-muted italic">
                    {t('admin.noProducts', locale)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
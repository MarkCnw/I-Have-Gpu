// components/ProductCard.tsx
'use client'

import Link from 'next/link'
import FavoriteButton from './FavoriteButton' 
import { Camera } from 'lucide-react' // 👈 Import

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ product, isFavorite = false }: { product: any, isFavorite?: boolean }) {
  
  return (
    <Link href={`/products/${product.id}`} className="block group h-full">
      <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative">
        
        <div className="absolute top-2 right-2 z-20" onClick={(e) => e.preventDefault()}>
           <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
        </div>

        <div className="h-56 p-6 flex items-center justify-center bg-white relative overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            /* เปลี่ยน Emoji เป็น Icon */
            <div className="text-neutral-300 flex flex-col items-center gap-2">
              <Camera size={40} />
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-50 flex flex-col flex-grow">
          <div className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">
            {product.category}
          </div>
          
          <h2 className="text-sm font-bold text-slate-800 mb-2 line-clamp-2 h-10 leading-tight group-hover:text-red-600 transition-colors">
            {product.name}
          </h2>
          
          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-lg font-bold text-red-600">
              ฿{Number(product.price).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
              ดูรายละเอียด &gt;
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
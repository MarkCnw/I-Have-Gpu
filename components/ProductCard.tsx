// components/ProductCard.tsx
'use client'

import { useBuilderStore } from '@/app/store/useBuilderStore'
import { useCompatibility } from '@/hooks/useCompatibility'
import FavoriteButton from './FavoriteButton' 

const formatSpecs = (specs: any) => {
  if (!specs) return ''
  const importantKeys = ['socket', 'chipset', 'capacity', 'vram', 'watt', 'type', 'bus']
  return Object.entries(specs)
    .filter(([key]) => importantKeys.some(k => key.includes(k)))
    .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
    .join(' | ')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ product, isFavorite = false }: { product: any, isFavorite?: boolean }) {
  const { selectPart, selectedParts } = useBuilderStore()
  const { checkCompatibility } = useCompatibility()
  const { compatible, reason } = checkCompatibility(product)
  
  // เช็ค case-insensitive
  const isSelected = selectedParts[product.category?.toLowerCase()]?.id === product.id
  const isDisabled = !compatible || isSelected

  return (
    <div className={`
      bg-white rounded-lg overflow-hidden transition-all duration-300 group relative
      ${isSelected 
        ? 'ring-2 ring-red-600 shadow-xl' 
        : 'border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1'
      }
      ${!compatible ? 'opacity-60 grayscale' : ''}
    `}>
      
      {/* ปุ่ม Favorite (มุมขวาบน) */}
      <div className="absolute top-2 right-2 z-20">
         <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
      </div>

      {/* ป้ายเตือน Incompatible */}
      {!compatible && (
        <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
          ⛔ {reason}
        </div>
      )}

      {/* รูปสินค้า (พื้นขาว) */}
      <div className="h-56 p-6 flex items-center justify-center bg-white relative">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="text-slate-300 text-4xl">📷</div>
        )}
      </div>

      {/* เนื้อหา */}
      <div className="p-4 bg-white border-t border-slate-50">
        {/* หมวดหมู่ */}
        <div className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">
          {product.category}
        </div>
        
        {/* ชื่อสินค้า (ตัดคำ) */}
        <h2 className="text-sm font-bold text-slate-800 mb-2 line-clamp-2 h-10 leading-tight group-hover:text-red-600 transition-colors" title={product.name}>
          {product.name}
        </h2>
        
        {/* Specs ย่อ */}
        <p className="text-[10px] text-slate-500 mb-3 line-clamp-1">
          {formatSpecs(product.specs)}
        </p>

        <div className="flex flex-col gap-2 mt-auto">
          {/* ราคา */}
          <div className="text-xl font-bold text-slate-900">
            ฿{Number(product.price).toLocaleString()}
          </div>
          
          {/* ปุ่มเพิ่มลงสเปค */}
          <button
            onClick={() => compatible && selectPart(product.category, product)}
            disabled={isDisabled}
            className={`w-full py-2 rounded text-sm font-bold transition
              ${isSelected 
                ? 'bg-red-600 text-white cursor-default' 
                : compatible
                  ? 'bg-slate-900 text-white hover:bg-red-600'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {isSelected ? 'เลือกแล้ว ✓' : compatible ? 'ใส่สเปค +' : 'ใส่ไม่ได้'}
          </button>
        </div>
      </div>
    </div>
  )
}
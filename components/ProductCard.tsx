// components/ProductCard.tsx
'use client'

import { useBuilderStore } from '@/app/store/useBuilderStore'
import { useCompatibility } from '@/hooks/useCompatibility'
import FavoriteButton from './FavoriteButton' 

const formatSpecs = (specs: any) => {
  if (!specs) return ''
  // เลือกโชว์เฉพาะค่าสำคัญ 1-2 ค่าพอสำหรับ Minimal Style
  const importantKeys = ['chipset', 'capacity', 'vram', 'watt']
  const found = Object.entries(specs).find(([key]) => importantKeys.some(k => key.includes(k)))
  if (found) return `${found[0].toUpperCase()}: ${found[1]}`
  return 'See Details'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductCard({ product, isFavorite = false }: { product: any, isFavorite?: boolean }) {
  const { selectPart, selectedParts } = useBuilderStore()
  const { checkCompatibility } = useCompatibility()
  const { compatible, reason } = checkCompatibility(product)
  
  const isSelected = selectedParts[product.category?.toLowerCase()]?.id === product.id

  return (
    <div className="group relative flex flex-col h-full">
      
      {/* 1. Image Area: Clean Gray Background */}
      <div className={`
        relative aspect-square rounded-2xl bg-[#F5F5F7] overflow-hidden mb-4 transition-all duration-300
        ${isSelected ? 'ring-1 ring-black shadow-lg' : 'hover:bg-[#EAEAEB]'}
        ${!compatible ? 'opacity-50 grayscale' : ''}
      `}>
         {/* Badge: Incompatible */}
         {!compatible && (
            <div className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur text-black text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">
               ⛔ {reason}
            </div>
         )}
         
         {/* Favorite Button (Visible on Hover) */}
         <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <FavoriteButton productId={product.id} initialIsFavorite={isFavorite} />
         </div>

         {/* Product Image */}
         <div className="w-full h-full p-8 flex items-center justify-center">
            {product.image ? (
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
               />
            ) : (
               <div className="text-neutral-300 text-3xl">📷</div>
            )}
         </div>

         {/* Add Button (Floats up on Hover) */}
         {compatible && (
            <button
               onClick={() => selectPart(product.category, product)}
               disabled={isSelected}
               className={`absolute bottom-4 left-4 right-4 h-10 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 ease-out
                  ${isSelected 
                    ? 'bg-black text-white cursor-default translate-y-0' 
                    : 'bg-white text-black hover:bg-black hover:text-white'
                  }
               `}
            >
               {isSelected ? 'Selected' : 'Add to Build'}
            </button>
         )}
      </div>

      {/* 2. Text Content */}
      <div className="flex-1 flex flex-col">
         <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
            {product.category}
         </div>
         
         <h3 className="text-sm font-medium text-neutral-900 leading-snug line-clamp-2 mb-2 group-hover:text-neutral-600 transition-colors" title={product.name}>
            {product.name}
         </h3>
         
         <div className="mt-auto flex items-end justify-between border-t border-neutral-100 pt-3">
            <span className="text-base font-semibold text-neutral-900">
               ฿{Number(product.price).toLocaleString()}
            </span>
            <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">
               {formatSpecs(product.specs)}
            </span>
         </div>
      </div>

    </div>
  )
}
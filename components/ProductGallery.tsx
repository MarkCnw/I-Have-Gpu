'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(images[0])

  return (
    <div className="flex flex-col gap-4">
      {/* รูปใหญ่ */}
      <div className="aspect-square bg-white rounded-2xl border border-neutral-100 p-8 flex items-center justify-center relative overflow-hidden group shadow-sm">
         <Image 
           src={mainImage} 
           alt="Product Image" 
           fill
           className="object-contain p-8 mix-blend-multiply transition-all duration-500 group-hover:scale-105"
         />
      </div>

      {/* รูปเล็ก (Thumbnails) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
           {images.map((img, idx) => (
             <button 
               key={idx}
               onClick={() => setMainImage(img)}
               className={`aspect-square bg-white rounded-xl border p-2 relative cursor-pointer hover:border-black transition-all overflow-hidden ${mainImage === img ? 'border-black ring-1 ring-black' : 'border-neutral-100'}`}
             >
                <Image src={img} alt={`Thumb ${idx}`} fill className="object-contain p-1 mix-blend-multiply" />
             </button>
           ))}
        </div>
      )}
    </div>
  )
}
// components/BuildSummaryBar.tsx
'use client'

import { useBuilderStore } from '@/app/store/useBuilderStore'
import { useState } from 'react'

export default function BuildSummaryBar() {
  const { selectedParts, getTotalPrice, removePart } = useBuilderStore()
  const [loading, setLoading] = useState(false)

  const totalPrice = getTotalPrice()
  const selectedItems = Object.values(selectedParts).filter((item) => item !== null)

  if (selectedItems.length === 0) return null

  const handleCheckout = async () => {
    const confirm = window.confirm(`Confirm purchase of ฿${totalPrice.toLocaleString()}?`)
    if (!confirm) return

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems,
          totalPrice: totalPrice
        })
      })

      const data = await res.json()

      if (data.success) {
        alert('✅ Order placed successfully! Order ID: ' + data.orderId)
        window.location.reload()
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (err) {
      alert('❌ Connection error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 flex-1">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Your Build ({selectedItems.length}):
            </span>
            <div className="flex gap-2">
              {selectedItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative group flex-shrink-0 bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition"
                >
                  <div className="w-12 h-12 bg-white rounded overflow-hidden">
                    <img 
                      src={item.image || ''} 
                      alt={item.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <button
                    onClick={() => removePart(item.category)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs text-gray-500">Total Price</div>
              <div className="text-2xl font-bold text-gray-900">
                ฿{totalPrice.toLocaleString()}
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className={`
                px-8 py-3 rounded-lg font-medium text-white transition-all
                ${loading 
                  ? 'bg-gray-400 cursor-wait' 
                  : 'bg-black hover:bg-gray-800 active:scale-95'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Checkout'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
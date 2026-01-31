// app/locations/page.tsx
import Link from 'next/link'
// 1. Import ไอคอน
import { MapPin, Phone, Map, ArrowLeft } from 'lucide-react'

export default function LocationsPage() {
  const branches = [
    {
      name: "สาขาใหญ่ (HQ) - Pantip Plaza",
      address: "ชั้น 4 ห้อง 404, พันธุ์ทิพย์ พลาซ่า ประตูน้ำ",
      phone: "02-123-4567",
      map: "https://maps.google.com"
    },
    {
      name: "สาขา Fortune Town",
      address: "ชั้น 3 โซน IT Mall, ฟอร์จูน ทาวน์",
      phone: "02-987-6543",
      map: "https://maps.google.com"
    },
    {
      name: "สาขา Zeer Rangsit",
      address: "ชั้น 2 เซียร์ รังสิต",
      phone: "02-555-9999",
      map: "https://maps.google.com"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-slate-400 hover:text-white transition mb-4 inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Shop
          </Link>
          <h1 className="text-4xl font-bold text-emerald-400 flex items-center gap-3">
            <MapPin size={36} /> สาขาทั้งหมด
          </h1>
          <p className="text-slate-400 mt-2">แวะมาดูสินค้าจริง หรือรับคำปรึกษาจากผู้เชี่ยวชาญได้ที่สาขาใกล้บ้านคุณ</p>
        </div>

        <div className="grid gap-6">
          {branches.map((branch, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{branch.name}</h2>
                <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-500" /> {branch.address}
                </p>
                <p className="text-emerald-400 text-sm flex items-center gap-2">
                  <Phone size={14} /> {branch.phone}
                </p>
              </div>
              <a 
                href={branch.map} 
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm border border-slate-600 transition flex items-center gap-2"
              >
                <Map size={16} /> Google Maps
              </a>
            </div>
          ))}
        </div>

        {/* Mock Map Image */}
        <div className="mt-8 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 h-64 flex items-center justify-center bg-grid-slate-700/50">
           <p className="text-slate-500 flex items-center gap-2">
             <Map size={24} /> [ พื้นที่สำหรับ Embed Google Maps API ]
           </p>
        </div>
      </div>
    </div>
  )
}
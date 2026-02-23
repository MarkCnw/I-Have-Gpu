// components/TaxInvoiceForm.tsx
'use client'

import { useState } from 'react'
import { FileText, Building2, User, MapPin, Hash, Check } from 'lucide-react'

export default function TaxInvoiceForm() {
  const [isRequesting, setIsRequesting] = useState(false)
  const [taxType, setTaxType] = useState<'personal' | 'corporate'>('personal')

  // State สำหรับเก็บข้อมูล (นำไปส่ง API ต่อได้)
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    branch: 'สำนักงานใหญ่', // หรือกรอกเลขสาขา
    address: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      {/* 🔘 ปุ่ม Toggle เปิด/ปิด การขอใบกำกับภาษี */}
      <div 
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer p-4 md:p-6 flex items-center justify-between shadow-sm
          ${isRequesting 
            ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-500/30' 
            : 'bg-surface-card border-border-main hover:border-foreground/30'
          }
        `}
        onClick={() => setIsRequesting(!isRequesting)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full transition-colors duration-300 ${isRequesting ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-surface-bg text-txt-muted'}`}>
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">ขอใบกำกับภาษีเต็มรูปแบบ</h3>
            <p className="text-sm text-txt-muted mt-0.5">สำหรับบุคคลธรรมดาและนิติบุคคล (E-Tax Invoice)</p>
          </div>
        </div>

        {/* Custom Toggle Switch */}
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${isRequesting ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${isRequesting ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      </div>

      {/* 📝 ฟอร์มกรอกข้อมูล (ใช้ Grid transition ให้สมูทตอนเปิด/ปิด) */}
      <div 
        className={`grid transition-all duration-500 ease-in-out ${
          isRequesting ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 rounded-2xl bg-surface-card border border-border-main shadow-sm">
            
            {/* ตัวเลือกประเภท: บุคคลธรรมดา / นิติบุคคล */}
            <div className="flex gap-4 mb-6 p-1 bg-surface-bg rounded-xl">
              <button
                type="button"
                onClick={() => setTaxType('personal')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  taxType === 'personal' 
                    ? 'bg-surface-card text-foreground shadow-sm border border-border-main' 
                    : 'text-txt-muted hover:text-foreground'
                }`}
              >
                <User size={16} /> บุคคลธรรมดา
              </button>
              <button
                type="button"
                onClick={() => setTaxType('corporate')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  taxType === 'corporate' 
                    ? 'bg-surface-card text-foreground shadow-sm border border-border-main' 
                    : 'text-txt-muted hover:text-foreground'
                }`}
              >
                <Building2 size={16} /> นิติบุคคล
              </button>
            </div>

            {/* ช่องกรอกข้อมูล */}
            <div className="space-y-5">
              
              {/* ชื่อ-นามสกุล / ชื่อบริษัท */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {taxType === 'personal' ? 'ชื่อ - นามสกุล' : 'ชื่อบริษัท / นิติบุคคล'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-muted">
                    {taxType === 'personal' ? <User size={18} /> : <Building2 size={18} />}
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-surface-bg border border-border-main rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder={taxType === 'personal' ? 'นาย สมชาย ใจดี' : 'บริษัท ตัวอย่าง จำกัด'}
                    required
                  />
                </div>
              </div>

              {/* เลขประจำตัวผู้เสียภาษี & สาขา (ถ้าเป็นนิติบุคคล) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    เลขประจำตัวผู้เสียภาษี (13 หลัก) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txt-muted">
                      <Hash size={18} />
                    </div>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      maxLength={13}
                      className="w-full pl-10 pr-4 py-3 bg-surface-bg border border-border-main rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                      placeholder="0123456789012"
                      required
                    />
                  </div>
                </div>

                {taxType === 'corporate' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      สำนักงานใหญ่ / สาขา <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface-bg border border-border-main rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                      placeholder="เช่น สำนักงานใหญ่ หรือ สาขา 0001"
                      required
                    />
                  </div>
                )}
              </div>

              {/* ที่อยู่ */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ที่อยู่ (ตามหน้าบัตรประชาชน / ภ.พ.20) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-txt-muted">
                    <MapPin size={18} />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-surface-bg border border-border-main rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none"
                    placeholder="เลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                    required
                  ></textarea>
                </div>
              </div>

            </div>
            
            {/* Note เตือนใจ */}
            <div className="mt-6 flex items-start gap-2 text-xs text-txt-muted bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-500/20">
              <Check size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <p>โปรดตรวจสอบความถูกต้องของข้อมูล (ชื่อและเลขประจำตัวผู้เสียภาษี) ทางบริษัทขอสงวนสิทธิ์ในการแก้ไขใบกำกับภาษีย้อนหลังในทุกกรณี</p>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
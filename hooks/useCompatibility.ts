// hooks/useCompatibility.ts

import { useBuilderStore } from "@/app/store/useBuilderStore"


export function useCompatibility() {
  const { selectedParts } = useBuilderStore()

  // ฟังก์ชันเช็คว่าสินค้านี้ "เข้ากันได้" กับของในตะกร้าไหม?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkCompatibility = (product: any) => {
    // 1. ถ้ายังไม่ได้เลือกอะไรเลย ก็ถือว่าผ่านหมด
    if (!product) return { compatible: true, reason: '' }

    // --- CASE 1: เลือก Mainboard ---
    // ต้องเช็คว่า Socket ตรงกับ CPU ที่เลือกไว้ไหม?
    if (product.category === 'MOTHERBOARD') {
      const selectedCPU = selectedParts['CPU']
      if (selectedCPU) {
        // เช่น CPU เป็น LGA1700 แต่บอร์ดเป็น AM5 -> ไม่ผ่าน
        if (selectedCPU.specs.socket !== product.specs.socket) {
          return { 
            compatible: false, 
            reason: `Socket ไม่ตรงกัน! (CPU เป็น ${selectedCPU.specs.socket})` 
          }
        }
      }
    }

    // --- CASE 2: เลือก RAM ---
    // ต้องเช็คว่าชนิดแรม (DDR4/5) ตรงกับ Mainboard ที่เลือกไว้ไหม?
    if (product.category === 'RAM') {
      const selectedMB = selectedParts['MOTHERBOARD']
      if (selectedMB) {
        // เช่น บอร์ดรับ DDR5 แต่เลือกแรม DDR4 -> ไม่ผ่าน
        // (เช็คว่าบอร์ดรองรับแรมชนิดนี้ไหม)
        // หมายเหตุ: ใน DB บอร์ดบางตัวผมใส่ memory_type ไว้
        if (selectedMB.specs.memory_type && !product.specs.type.includes(selectedMB.specs.memory_type)) {
           return { 
            compatible: false, 
            reason: `บอร์ดนี้รับเฉพาะ ${selectedMB.specs.memory_type}` 
          }
        }
      }
    }

    // --- CASE 3: เลือก CPU (ย้อนกลับ) ---
    // ถ้าเลือกบอร์ดไว้แล้ว จะมาเปลี่ยน CPU ต้องดูว่า Socket ตรงไหม
    if (product.category === 'CPU') {
       const selectedMB = selectedParts['MOTHERBOARD']
       if (selectedMB && selectedMB.specs.socket !== product.specs.socket) {
          return { 
            compatible: false, 
            reason: `Socket ไม่ตรงกับบอร์ดที่เลือก (${selectedMB.specs.socket})` 
          }
       }
    }

    // ถ้าผ่านทุกด่าน
    return { compatible: true, reason: '' }
  }

  return { checkCompatibility }
}
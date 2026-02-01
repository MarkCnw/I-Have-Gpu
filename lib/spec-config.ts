// lib/spec-config.ts

// 1. กำหนดประเภทของข้อมูลสเปค
export interface SpecField {
  key: string       // key ที่จะเก็บใน JSON (เช่น "bus")
  label: string     // ชื่อที่โชว์ให้ Admin เห็น (เช่น "Bus Speed")
  type: 'text' | 'number' | 'select'
  options?: string[] // ตัวเลือกสำหรับ Dropdown
  placeholder?: string
  suffix?: string   // หน่วย (เช่น "MHz", "GB")
}

// 2. กำหนดว่าแต่ละ Category ต้องกรอกอะไรบ้าง
export const CATEGORY_SPECS: Record<string, SpecField[]> = {
  CPU: [
    { key: 'brand', label: 'Brand', type: 'select', options: ['Intel', 'AMD'] },
    { key: 'socket', label: 'Socket', type: 'text', placeholder: 'LGA1700, AM5' },
    { key: 'cores', label: 'Cores', type: 'number' },
    { key: 'threads', label: 'Threads', type: 'number' },
    { key: 'base_clock', label: 'Base Clock', type: 'text', suffix: 'GHz' },
    { key: 'boost_clock', label: 'Boost Clock', type: 'text', suffix: 'GHz' },
  ],
  GPU: [
    { key: 'chipset', label: 'Chipset Manufacturer', type: 'select', options: ['NVIDIA', 'AMD', 'Intel'] },
    { key: 'model', label: 'Model Series', type: 'text', placeholder: 'RTX 4060, RX 7800' },
    { key: 'vram', label: 'VRAM Capacity', type: 'number', suffix: 'GB' },
    { key: 'vram_type', label: 'VRAM Type', type: 'select', options: ['GDDR6', 'GDDR6X'] },
    { key: 'interface', label: 'Interface', type: 'text', placeholder: 'PCIe 4.0 x8' },
  ],
  RAM: [
    { key: 'type', label: 'Memory Type', type: 'select', options: ['DDR4', 'DDR5'] },
    { key: 'capacity', label: 'Capacity', type: 'text', placeholder: '16GB (8x2), 32GB' },
    { key: 'bus', label: 'Bus Speed', type: 'number', suffix: 'MHz' },
    { key: 'latency', label: 'CAS Latency (CL)', type: 'number' },
  ],
  MOTHERBOARD: [
    { key: 'socket', label: 'Socket', type: 'text', placeholder: 'LGA1700, AM5' },
    { key: 'chipset', label: 'Chipset', type: 'text', placeholder: 'Z790, B650' },
    { key: 'form_factor', label: 'Form Factor', type: 'select', options: ['ATX', 'mATX', 'ITX'] },
    { key: 'memory_slots', label: 'Memory Slots', type: 'number' },
  ],
  MONITOR: [
    { key: 'size', label: 'Screen Size', type: 'number', suffix: 'inch' },
    { key: 'resolution', label: 'Resolution', type: 'text', placeholder: '1920x1080' },
    { key: 'panel', label: 'Panel Type', type: 'select', options: ['IPS', 'VA', 'TN', 'OLED'] },
    { key: 'refresh_rate', label: 'Refresh Rate', type: 'number', suffix: 'Hz' },
  ],
  STORAGE: [
    { key: 'type', label: 'Type', type: 'select', options: ['M.2 NVMe', 'SATA SSD', 'HDD'] },
    { key: 'capacity', label: 'Capacity', type: 'text', placeholder: '1TB, 500GB' },
    { key: 'read_speed', label: 'Read Speed', type: 'number', suffix: 'MB/s' },
    { key: 'write_speed', label: 'Write Speed', type: 'number', suffix: 'MB/s' },
  ],
  PSU: [
    { key: 'wattage', label: 'Wattage', type: 'number', suffix: 'W' },
    { key: 'certification', label: '80+ Certification', type: 'select', options: ['White', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium'] },
    { key: 'modularity', label: 'Modularity', type: 'select', options: ['Full', 'Semi', 'Non'] },
  ],
  // ... เพิ่มหมวดอื่นๆ ตามต้องการ
}
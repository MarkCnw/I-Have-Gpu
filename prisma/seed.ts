// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Start seeding...')

  // ล้างข้อมูลเก่าก่อน (เผื่อรันซ้ำ)
  await prisma.product.deleteMany()

  // 1. CPU
  await prisma.product.createMany({
    data: [
      {
        name: 'Intel Core i5-13500',
        price: 9590,
        category: 'CPU',
        image: 'https://ih1.redbubble.net/image.4996924531.6033/st,small,507x507-pad,600x600,f8f8f8.jpg',
        specs: { socket: 'LGA1700', core: 14, thread: 20, base_clock: '2.5 GHz', boost_clock: '4.8 GHz', tdp: 65, integrated_graphics: true }
      },
      {
        name: 'AMD Ryzen 5 7600X',
        price: 8900,
        category: 'CPU',
        image: 'https://m.media-amazon.com/images/I/51f2hk81eGL.jpg',
        specs: { socket: 'AM5', core: 6, thread: 12, base_clock: '4.7 GHz', boost_clock: '5.3 GHz', tdp: 105, integrated_graphics: true }
      },
      {
        name: 'Intel Core i9-14900K',
        price: 24500,
        category: 'CPU',
        image: 'https://m.media-amazon.com/images/I/61u9Zqf9-rL.jpg',
        specs: { socket: 'LGA1700', core: 24, thread: 32, base_clock: '3.2 GHz', boost_clock: '6.0 GHz', tdp: 125, integrated_graphics: true }
      },
    ],
  })

  // 2. Mainboard
  await prisma.product.createMany({
    data: [
      {
        name: 'ASUS PRIME B760M-A WIFI',
        price: 5190,
        category: 'MOTHERBOARD',
        image: 'https://dlcdnwebimgs.asus.com/gain/9d5a9632-6e27-4632-a56e-5896a604294b/',
        specs: { socket: 'LGA1700', memory_type: 'DDR5', form_factor: 'mATX', max_memory: 128, m2_slots: 2 }
      },
      {
        name: 'GIGABYTE B650 AORUS ELITE AX',
        price: 7290,
        category: 'MOTHERBOARD',
        image: 'https://static.gigabyte.com/StaticFile/Image/Global/07e5f39695655a9b734891b920409745/Product/33649/png/1000',
        specs: { socket: 'AM5', memory_type: 'DDR5', form_factor: 'ATX', max_memory: 128, m2_slots: 3 }
      },
      {
        name: 'MSI PRO H610M-E DDR4', // บอร์ดรุ่นประหยัด ใช้แรม DDR4
        price: 2590,
        category: 'MOTHERBOARD',
        image: 'https://asset.msi.com/resize/image/global/product/product_1642578579d4793f77df3c9b77546686121404c10c.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png',
        specs: { socket: 'LGA1700', memory_type: 'DDR4', form_factor: 'mATX', max_memory: 64, m2_slots: 1 }
      }
    ],
  })

  // 3. RAM
  await prisma.product.createMany({
    data: [
      {
        name: 'Kingston FURY Beast 16GB (8x2) DDR5 5200MHz',
        price: 2490,
        category: 'RAM',
        image: 'https://m.media-amazon.com/images/I/51t-15jS+TL._AC_UF894,1000_QL80_.jpg',
        specs: { type: 'DDR5', capacity: '16GB', speed: 5200, modules: 2, rgb: false }
      },
      {
        name: 'Corsair Vengeance LPX 16GB (8x2) DDR4 3200MHz',
        price: 1590,
        category: 'RAM',
        image: 'https://m.media-amazon.com/images/I/51kHiPeTSmL._AC_UF894,1000_QL80_.jpg',
        specs: { type: 'DDR4', capacity: '16GB', speed: 3200, modules: 2, rgb: false }
      },
    ],
  })

  // 4. GPU
  await prisma.product.createMany({
    data: [
      {
        name: 'ASUS ROG Strix GeForce RTX 4070 Ti',
        price: 34900,
        category: 'GPU',
        image: 'https://dlcdnwebimgs.asus.com/gain/4a85635f-3957-4148-9366-077030800366/',
        specs: { chipset: 'NVIDIA', vram: '12GB', length: 336, recommended_psu: 750 }
      },
      {
        name: 'Gigabyte GeForce RTX 3060 WINDFORCE OC 12G',
        price: 9900,
        category: 'GPU',
        image: 'https://static.gigabyte.com/StaticFile/Image/Global/899125301e7497127670180436815801/Product/27829/png/1000',
        specs: { chipset: 'NVIDIA', vram: '12GB', length: 198, recommended_psu: 550 }
      }
    ],
  })

  console.log('✅ Seeding finished.')
  const demoUser = await prisma.user.create({
    data: {
      email: 'customer@game.com',
      password: 'password123', // ของจริงต้อง Hash แต่ออันนี้เทสต์ก่อน
      name: 'Mr. Gamer',
      role: 'USER'
    }
  })
  console.log('👤 Created Demo User:', demoUser.id)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
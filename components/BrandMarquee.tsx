// components/BrandMarquee.tsx
'use client'
import Marquee from 'react-fast-marquee'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

const BRANDS_ROW_1 = [
  { name: "NVIDIA", logo: "https://cdn.simpleicons.org/nvidia" },
  { name: "Intel", logo: "https://cdn.simpleicons.org/intel" },
  { name: "AMD", logo: "https://cdn.worldvectorlogo.com/logos/amd-logo-1.svg" },
  { name: "Asus", logo: "https://cdn.worldvectorlogo.com/logos/asus-4.svg" },
  { name: "MSI", logo: "https://cdn.simpleicons.org/msi" },
  { name: "Gigabyte", logo: "https://cdn.worldvectorlogo.com/logos/gigabyte-technology-logo-2008.svg" },
  { name: "EVGA", logo: "https://cdn.worldvectorlogo.com/logos/evga.svg" },
  { name: "NZXT", logo: "https://cdn.simpleicons.org/nzxt" },
  { name: "Cooler Master", logo: "https://cdn.simpleicons.org/coolermaster" },
  { name: "Xbox", logo: "https://cdn.worldvectorlogo.com/logos/xbox-9.svg" },
  { name: "Western Digital", logo: "https://cdn.worldvectorlogo.com/logos/western-digital-2.svg" },
  { name: "Kingston", logo: "https://cdn.simpleicons.org/kingstontechnology" },
  { name: "Crucial", logo: "https://static.cdnlogo.com/logos/c/1/crucial_thumb.png" },
  { name: "Secretlab", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Transparent_SecretLab_Logo%28black_font%29%281%29.png/1280px-Transparent_SecretLab_Logo%28black_font%29%281%29.png?20180307095928" },
  { name: "Glorious", logo: "https://cdn.brandfetch.io/idGOvrPLsC/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" },
  { name: "Aorus", logo: "https://logodownload.org/wp-content/uploads/2020/10/aorus-logo-1.png" },
]

const BRANDS_ROW_2 = [
  { name: "Logitech", logo: "https://static.cdnlogo.com/logos/l/54/logitech-gaming.svg" },
  { name: "Razer", logo: "https://cdn.simpleicons.org/razer" },
  { name: "Corsair", logo: "https://cdn.simpleicons.org/corsair" },
  { name: "SteelSeries", logo: "https://cdn.simpleicons.org/steelseries" },
  { name: "HyperX", logo: "https://static.cdnlogo.com/logos/h/21/hyperx-thumb.png" },
  { name: "Dell", logo: "https://cdn.simpleicons.org/dell" },
  { name: "HP", logo: "https://cdn.simpleicons.org/hp" },
  { name: "Lenovo", logo: "https://cdn.worldvectorlogo.com/logos/lenovo-2.svg" },
  { name: "Acer", logo: "https://cdn.simpleicons.org/acer" },
  { name: "Alienware", logo: "https://cdn.simpleicons.org/alienware" },
  { name: "ROG", logo: "https://static.cdnlogo.com/logos/a/12/asus-rog_thumb.png" },
]

export default function BrandMarquee() {
  const { locale } = useLanguageStore()

  return (
    <div className="w-full py-16 bg-surface-card overflow-hidden border-t border-border-light">
      <div className="max-w-[1400px] mx-auto mb-12 text-center px-6">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-txt-muted">{t('brand.subtitle', locale)}</span>
        <h2 className="text-3xl font-bold text-foreground mt-2">{t('brand.title', locale)}</h2>
      </div>

      <div className="relative flex flex-col gap-12">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-card to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-card to-transparent z-10 pointer-events-none"></div>

        <Marquee gradient={false} speed={35} pauseOnHover={true} direction="left">
          {BRANDS_ROW_1.map((brand, index) => (
            <div key={index} className="mx-14 flex items-center justify-center h-24 w-32">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-16 w-full object-contain hover:scale-110 transition-transform duration-300 drop-shadow-sm dark:invert"
              />
            </div>
          ))}
        </Marquee>

        <Marquee gradient={false} speed={35} pauseOnHover={true} direction="right">
          {BRANDS_ROW_2.map((brand, index) => (
            <div key={index} className="mx-14 flex items-center justify-center h-24 w-32">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-16 w-full object-contain hover:scale-110 transition-transform duration-300 drop-shadow-sm dark:invert"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  )
}
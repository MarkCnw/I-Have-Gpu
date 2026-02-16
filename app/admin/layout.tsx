// app/admin/layout.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, DollarSign, MessageCircle, ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { locale } = useLanguageStore()

  const menuItems = [
    { name: t('admin.dashboard', locale), href: '/admin', icon: LayoutDashboard },
    { name: t('admin.finance', locale), href: '/admin/finance', icon: DollarSign },
    { name: t('admin.products', locale), href: '/admin/products', icon: Package },
    { name: t('admin.orders', locale), href: '/admin/orders', icon: ShoppingCart },
    { name: t('admin.chat', locale), href: '/admin/chat', icon: MessageCircle },
  ]

  const breadcrumbNameMap: Record<string, string> = {
    admin: 'Admin',
    finance: t('admin.bread.finance', locale),
    products: t('admin.bread.products', locale),
    orders: t('admin.bread.orders', locale),
    chat: t('admin.bread.chat', locale),
    add: t('admin.bread.add', locale),
    edit: t('admin.bread.edit', locale)
  }

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')

    return (
      <div className="flex items-center gap-2 text-sm text-txt-muted mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">{t('admin.bread.home', locale)}</Link>
        <ChevronRight size={14} className="text-border-main" />

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`
          const isLast = index === pathSegments.length - 1
          const name = breadcrumbNameMap[segment] || segment

          return (
            <div key={href} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-bold text-foreground capitalize">{name}</span>
              ) : (
                <>
                  <Link href={href} className="hover:text-foreground transition-colors capitalize">
                    {name}
                  </Link>
                  <ChevronRight size={14} className="text-border-main" />
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-surface-bg font-sans text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-card border-r border-border-main fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-border-main">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-foreground text-surface-card px-2 py-1 rounded text-sm">ADMIN</span>
            <span>{t('admin.panel', locale)}</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                  ? 'bg-foreground text-surface-card shadow-md'
                  : 'text-txt-muted hover:bg-surface-bg hover:text-foreground'
                  }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border-main space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-txt-muted hover:bg-surface-bg transition-all font-medium">
            <Store size={20} /> {t('admin.backToStore', locale)}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all font-medium"
          >
            <LogOut size={20} /> {t('admin.logout', locale)}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {getBreadcrumbs()}
        {children}
      </main>
    </div>
  )
}
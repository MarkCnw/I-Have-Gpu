// components/ProductSectionHeader.tsx
'use client'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

interface Props {
    type: 'title' | 'products' | 'empty' | 'clearFilters'
    q?: string
    currentCategory?: string
}

export default function ProductSectionHeader({ type, q, currentCategory }: Props) {
    const { locale } = useLanguageStore()

    switch (type) {
        case 'title':
            if (q) return <>{t('home.searchResults', locale)} &quot;{q}&quot;</>
            if (currentCategory === 'ALL') return <>{t('home.selectedForYou', locale)}</>
            return <>{currentCategory}</>
        case 'products':
            return <>{t('home.products', locale)}</>
        case 'empty':
            return <p className="text-txt-secondary">{t('home.noProducts', locale)}</p>
        case 'clearFilters':
            return <>{t('home.clearFilters', locale)}</>
        default:
            return null
    }
}

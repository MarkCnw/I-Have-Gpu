'use client'

import Link from 'next/link'
import { MapPin, Phone, Map, ArrowLeft } from 'lucide-react'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { t } from '@/lib/i18n'

export default function LocationsClient() {
    const { locale } = useLanguageStore()

    const branches = [
        {
            name: t('locations.branch1Name', locale),
            address: t('locations.branch1Address', locale),
            phone: '02-123-4567',
            map: 'https://maps.google.com'
        },
        {
            name: t('locations.branch2Name', locale),
            address: t('locations.branch2Address', locale),
            phone: '02-987-6543',
            map: 'https://maps.google.com'
        },
        {
            name: t('locations.branch3Name', locale),
            address: t('locations.branch3Address', locale),
            phone: '02-555-9999',
            map: 'https://maps.google.com'
        }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-txt-muted hover:text-foreground transition mb-4 inline-flex items-center gap-2">
                        <ArrowLeft size={16} /> {t('locations.backToShop', locale)}
                    </Link>
                    <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                        <MapPin size={36} /> {t('locations.title', locale)}
                    </h1>
                    <p className="text-txt-muted mt-2">{t('locations.subtitle', locale)}</p>
                </div>

                <div className="grid gap-6">
                    {branches.map((branch, index) => (
                        <div key={index} className="bg-surface-card p-6 rounded-xl border border-border-main hover:border-yellow-500/50 transition shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-2">{branch.name}</h2>
                                <p className="text-txt-muted text-sm mb-1 flex items-center gap-2">
                                    <MapPin size={14} className="text-yellow-500" /> {branch.address}
                                </p>
                                <p className="text-yellow-500 text-sm flex items-center gap-2">
                                    <Phone size={14} /> {branch.phone}
                                </p>
                            </div>
                            <a
                                href={branch.map}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-surface-bg hover:bg-surface-card text-foreground px-4 py-2 rounded-lg text-sm border border-border-main transition flex items-center gap-2"
                            >
                                <Map size={16} /> Google Maps
                            </a>
                        </div>
                    ))}
                </div>

                {/* Mock Map */}
                <div className="mt-8 bg-surface-card rounded-xl overflow-hidden border border-border-main h-64 flex items-center justify-center">
                    <p className="text-txt-muted flex items-center gap-2">
                        <Map size={24} /> {t('locations.mapPlaceholder', locale)}
                    </p>
                </div>
            </div>
        </div>
    )
}

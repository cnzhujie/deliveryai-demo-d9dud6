import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ChevronRight, Flame, MapPin, QrCode, Sparkles, Users } from 'lucide-react'
import hotpot from '@/assets/hotpot.jpg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { products } from '@/data/menu'
import { money } from '@/lib/utils'
import type { Product } from '@/types'

const tableOptions = [
  { code: 'A08', areaKey: 'bind.area.hall', seats: 4 },
  { code: 'B12', areaKey: 'bind.area.booth', seats: 6 },
  { code: 'C06', areaKey: 'bind.area.room', seats: 4 },
  { code: 'D03', areaKey: 'bind.area.window', seats: 6 },
]

const recommendProducts = products.filter((p) => p.badge)

interface HomeViewProps { onBind: (table: string) => void }

export function HomeView({ onBind }: HomeViewProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Product | null>(null)

  const handleEnterOrder = () => {
    setSelected(null)
    onBind('A08')
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-rice-100 paper-noise">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-chili-100 blur-3xl" />
      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-amber-100 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-6 px-5 py-8 lg:gap-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <section className="animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-chili-500/20 bg-white/80 px-3 py-2 text-xs font-bold text-chili-600 shadow-sm">
              <Sparkles size={14} /> {t('common.concept_badge')}
            </div>
            <p className="mb-3 text-sm font-bold tracking-widest text-chili-500">{t('common.concept_en')}</p>
            <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-charcoal-900 sm:text-5xl lg:text-6xl">
              {t('bind.title_l1')}<br /><span className="text-chili-500">{t('bind.title_l2')}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-charcoal-500">{t('bind.desc')}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-charcoal-700">
              {[t('bind.feature1'), t('bind.feature2'), t('bind.feature3')].map((item) => (
                <span key={item} className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm"><Check size={15} className="text-chili-500" />{item}</span>
              ))}
            </div>
          </section>

          <section className="animate-rise rounded-3xl border border-white/80 bg-white/90 p-4 shadow-float backdrop-blur sm:p-6">
            <div className="relative mb-4 h-44 overflow-hidden rounded-2xl sm:h-52">
              <img src={hotpot} alt={t('bind.img_alt')} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div><p className="text-xs opacity-80">{t('common.simulated_store')}</p><h2 className="text-xl font-bold">{t('common.store_name')}</h2></div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">{t('common.open')}</span>
              </div>
            </div>
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-rice-100 p-3">
              <span className="rounded-xl bg-white p-3 text-chili-500 shadow-sm"><QrCode /></span>
              <div className="min-w-0 flex-1"><p className="font-bold text-charcoal-900">{t('bind.qr_title')}</p><p className="text-sm text-charcoal-500">{t('bind.qr_desc')}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {tableOptions.map(({ code, areaKey, seats }, index) => (
                <button key={code} onClick={() => onBind(code)} className="group rounded-2xl border border-charcoal-900/10 bg-white p-4 text-left transition hover:-translate-y-1 hover:border-chili-500 hover:shadow-card">
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-rice-100 text-sm font-extrabold text-chili-500">{index + 1}</span>
                  <p className="font-bold text-charcoal-900">{code} · {t(areaKey)}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-500"><Users size={13} /> {t('bind.seats', { count: seats })}</p>
                  <ChevronRight size={17} className="ml-auto mt-2 text-charcoal-500 transition group-hover:translate-x-1 group-hover:text-chili-500" />
                </button>
              ))}
            </div>
            <Button onClick={() => onBind('A08')} className="mt-4 w-full"><MapPin size={17} />{t('bind.quick_enter')}</Button>
          </section>
        </div>

        <section className="animate-rise">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-chili-500"><Flame size={14} />{t('home.recommend.title')}</span>
            <span className="text-sm text-charcoal-500">{t('home.recommend.subtitle')}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recommendProducts.map((product) => (
              <button key={product.id} onClick={() => setSelected(product)} className="group overflow-hidden rounded-2xl border border-charcoal-900/10 bg-white text-left transition hover:-translate-y-1 hover:border-chili-500 hover:shadow-card">
                <div className="relative h-28 overflow-hidden sm:h-32">
                  <img src={product.image} alt={t(product.name)} className="h-full w-full object-cover transition group-hover:scale-105" />
                  {product.badge && <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-extrabold text-charcoal-900">{t(product.badge)}</span>}
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-extrabold text-charcoal-900">{t(product.name)}</h3>
                  <p className="mt-1 text-lg font-extrabold text-chili-500">{money(product.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <DialogContent title={selected ? t(selected.name) : ''}>
          {selected && (
            <>
              <div className="mt-4 overflow-hidden rounded-2xl">
                <div className="relative h-40">
                  <img src={selected.image} alt={t(selected.name)} className="h-full w-full object-cover" />
                  {selected.badge && <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold text-charcoal-900">{t(selected.badge)}</span>}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm leading-6 text-charcoal-500">{t(selected.description)}</p>
                <p className="mt-2 text-xl font-extrabold text-chili-500">{money(selected.price)} <small className="text-xs font-medium text-charcoal-500">{t('menu.from')}</small></p>
              </div>
              <Button onClick={handleEnterOrder} className="mt-5 w-full"><MapPin size={17} />{t('home.recommend.detail_cta')}</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

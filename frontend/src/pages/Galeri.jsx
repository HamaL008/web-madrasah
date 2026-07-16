import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Image as ImageIcon, ArrowLeft } from 'lucide-react'
import api from '../api/axios'
import { useRevealObserver } from '../hooks/useReveal'
import logoImg from '../assets/logo.png'

export default function GaleriPage() {
  useRevealObserver()
  const navigate  = useNavigate()
  const [galeri, setGaleri]   = useState([])
  const [loading, setLoading] = useState(true)
  const [activecat, setActiveCat] = useState('Semua')

  useEffect(() => {
    api.get('/gallery')
      .then((r) => setGaleri(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => (
    ['Semua', ...[...new Set(galeri.map((g) => g.category).filter(Boolean))].sort()]
  ), [galeri])

  const filtered = activecat === 'Semua'
    ? galeri
    : galeri.filter((g) => g.category === activecat)

  return (
    <div className="min-h-screen bg-madrasah-bg">
      {/* Header */}
      <div className="text-white bg-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo Madrasah" className="w-11 h-11 object-contain" />
            <div>
              <p className="font-sans font-extrabold text-sm text-white leading-tight">Galeri Kegiatan</p>
              <p className="font-serif text-[11px] font-medium text-amber-300 tracking-wide">
                Madrasah Diniyyah Miftahul Ulum
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <ImageIcon className="w-3.5 h-3.5" /> Dokumentasi Kegiatan
          </div>
          <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-emerald-950 mb-2">
            Galeri Kegiatan Madrasah
          </h1>
          <p className="text-slate-500 text-sm">
            Seluruh dokumentasi kegiatan dan aktivitas Madrasah Miftahul Ulum.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter kategori */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 border-2 ${
                  activecat === cat
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-md'
                    : 'bg-transparent text-slate-500 border-slate-200 hover:border-emerald-900 hover:text-emerald-900 hover:bg-emerald-50/50'
                }`}
              >
                {cat}
                <span className={`ml-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                  activecat === cat ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {cat === 'Semua' ? galeri.length : galeri.filter((g) => g.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-3">
            <ImageIcon className="w-14 h-14" />
            <p className="text-sm text-slate-400">Belum ada foto dalam kategori ini.</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-6">
              Menampilkan <span className="font-bold text-slate-600">{filtered.length}</span> foto
              {activecat !== 'Semua' && <> dalam kategori <span className="font-bold text-emerald-700">{activecat}</span></>}
            </p>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="reveal reveal-scale group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 break-inside-avoid mb-4 w-full"
                >
                  <div className="relative w-full bg-slate-100">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.title} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500" />
                      : <div className="w-full h-48 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-950">
                          <ImageIcon className="w-9 h-9 text-emerald-600 mb-2" />
                          <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">Dokumentasi</span>
                        </div>
                    }
                    {/* Dark gradient overlay that appears on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Hover text content fading up */}
                    <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {item.category && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-max mb-2">
                          {item.category}
                        </span>
                      )}
                      <h4 className="font-extrabold text-white text-base mb-1">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-emerald-50 text-xs leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

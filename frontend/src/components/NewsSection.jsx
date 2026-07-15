import { useState, useEffect, useRef, useCallback } from 'react'
import { Newspaper, Calendar, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../api/axios'

function formatDate(str) {
  return new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function DetailModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-100 shrink-0">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />{formatDate(item.created_at)}
          </span>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 ml-2 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {item.image_url && (
            <img src={item.image_url} alt={item.title} className="w-full max-h-96 object-contain bg-slate-100 rounded-xl" />
          )}
          <h2 className="text-xl font-extrabold text-emerald-950 leading-snug">{item.title}</h2>
          {item.excerpt && (
            <p className="text-slate-500 text-sm italic border-l-2 border-emerald-400 pl-3">{item.excerpt}</p>
          )}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pt-2 border-t border-slate-100">
            {item.content}
          </div>
        </div>
      </div>
    </div>
  )
}

const AUTO_DELAY = 3500

export default function NewsSection() {
  const [news, setNews]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [current, setCurrent]   = useState(0)
  const timerRef = useRef(null)
  const pauseRef = useRef(false)

  useEffect(() => {
    api.get('/news')
      .then((res) => setNews(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const len = news.length

  const goNext = useCallback(() => {
    setCurrent((p) => (p + 1) % len)
  }, [len])

  const goPrev = useCallback(() => {
    setCurrent((p) => (p - 1 + len) % len)
  }, [len])

  // Auto-play
  useEffect(() => {
    if (len <= 1) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!pauseRef.current) goNext()
    }, AUTO_DELAY)
    return () => clearInterval(timerRef.current)
  }, [len, goNext])

  const pause  = () => { pauseRef.current = true }
  const resume = () => { pauseRef.current = false }

  const handleNav = (fn) => {
    fn()
    pause()
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!pauseRef.current) goNext()
    }, AUTO_DELAY)
    setTimeout(resume, AUTO_DELAY)
  }

  if (!loading && len === 0) return null

  // Tentukan indeks card yang tampil: current-1, current, current+1 (looping)
  // Jika berita <= 3, tampilkan semua terpusat
  const visibleCount = Math.min(len, 3)
  const isCentered   = len <= 3

  // Buat daftar indeks yang ditampilkan
  const getVisible = () => {
    if (len === 1) return [0]
    if (len === 2) return [current, (current + 1) % len]
    // 3+ berita: prev, current, next
    return [
      (current - 1 + len) % len,
      current,
      (current + 1) % len,
    ]
  }

  const visibleIdxs = getVisible()

  return (
    <>
      <section id="berita" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header — tengah */}
          <div className="reveal text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Newspaper className="w-3.5 h-3.5" /> Berita & Pengumuman
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-2">
              Kabar Terkini Madrasah
            </h2>
            <p className="text-slate-500 text-sm">
              Informasi terbaru seputar kegiatan dan pengumuman dari Madrasah Miftahul Ulum.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="relative" onMouseEnter={pause} onMouseLeave={resume}>

              {/* Tombol prev — sembunyikan jika berita <= 1 */}
              {len > 1 && (
                <button onClick={() => handleNav(goPrev)}
                  className="absolute left-0 top-1/2 -translate-y-8 -translate-x-2 z-10 p-2 rounded-full bg-white shadow-md border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-600 hover:text-emerald-800 transition-all hidden md:flex">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Cards */}
              <div className={`flex gap-5 ${isCentered ? 'justify-center' : 'justify-center'}`}>
                {visibleIdxs.map((newsIdx, pos) => {
                  const item    = news[newsIdx]
                  const isCenter = len === 1 || (len === 2 ? pos === 0 : pos === 1)
                  return (
                    <article
                      key={`${newsIdx}-${pos}`}
                      onClick={() => setSelected(item)}
                      className={`reveal reveal-scale bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer shrink-0 w-72 sm:w-80 p-2 ${
                        isCenter
                          ? 'scale-[1.02] shadow-md'
                          : 'opacity-80'
                      }`}
                    >
                      <div className="h-48 overflow-hidden bg-slate-100 shrink-0 rounded-2xl relative">
                        {item.image_url
                          ? <img src={item.image_url} alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-950">
                              <Newspaper className="w-10 h-10 text-emerald-600" />
                            </div>
                        }
                      </div>
                      <div className="px-4 py-5 flex flex-col flex-1">
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 mb-2.5">
                          <Calendar className="w-3 h-3 text-emerald-500" />{formatDate(item.created_at)}
                        </span>
                        <h3 className="font-extrabold text-emerald-950 text-base leading-snug mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{item.excerpt}</p>
                        )}
                        <div className="mt-auto flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
                          Baca Selengkapnya <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Tombol next */}
              {len > 1 && (
                <button onClick={() => handleNav(goNext)}
                  className="absolute right-0 top-1/2 -translate-y-8 translate-x-2 z-10 p-2 rounded-full bg-white shadow-md border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-600 hover:text-emerald-800 transition-all hidden md:flex">
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Mobile swipe buttons */}
              {len > 1 && (
                <div className="flex justify-center gap-3 mt-6 md:hidden">
                  <button onClick={() => handleNav(goPrev)}
                    className="p-2 rounded-full bg-white shadow border border-slate-200 text-slate-600">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleNav(goNext)}
                    className="p-2 rounded-full bg-white shadow border border-slate-200 text-slate-600">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Dot indicators */}
              {len > 1 && (
                <div className="flex justify-center gap-1.5 mt-5">
                  {news.map((_, i) => (
                    <button key={i}
                      onClick={() => { setCurrent(i); pause(); setTimeout(resume, AUTO_DELAY) }}
                      className={`rounded-full transition-all duration-300 ${
                        current === i
                          ? 'w-5 h-2 bg-emerald-700'
                          : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, ArrowLeft, ArrowRight, Newspaper } from 'lucide-react'
import { useRevealObserver } from '../hooks/useReveal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'

function formatDate(str) {
  return new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function NewsDetail() {
  useRevealObserver()
  
  const { slug } = useParams()
  const [news, setNews] = useState(null)
  const [allNews, setAllNews] = useState([])
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Scroll to top on load or when slug changes
    window.scrollTo(0, 0)
    
    setLoading(true)
    Promise.all([
      api.get('/content'),
      api.get(`/news/${slug}`),
      api.get('/news')
    ])
      .then(([contentRes, newsRes, allNewsRes]) => {
        setContent(contentRes.data)
        setNews(newsRes.data)
        setAllNews(allNewsRes.data ?? [])
      })
      .catch((err) => console.error('Gagal memuat detail berita:', err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Memuat Berita...</p>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white">
        <p className="text-sm text-emerald-300 mb-4">Berita tidak ditemukan.</p>
        <Link to="/" className="text-amber-400 hover:text-amber-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
      </div>
    )
  }

  const kontak = content ? {
    alamat: content.alamat, telepon: content.telepon,
    email: content.email, whatsapp: content.whatsapp, instagram: content.instagram,
  } : {}

  const otherNews = allNews.filter(n => n.id !== news.id).slice(0, 5)

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <Navbar logoName={content?.logo_name} />
      
      <main className="flex-1 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left: Main Image */}
            <div className="lg:col-span-2">
              <div className="w-full h-[350px] sm:h-[450px] lg:h-[550px] overflow-hidden bg-slate-200 relative shadow-lg rounded-xl">
                {news.image_url ? (
                  <img 
                    src={news.image_url} 
                    alt={news.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900 to-slate-900">
                    <Newspaper className="w-24 h-24 text-emerald-700" />
                  </div>
                )}
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Right: Berita Lainnya */}
            <div className="bg-white p-6 shadow-lg flex flex-col rounded-xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                Berita Lainnya
              </h3>
              <div className="flex flex-col flex-1">
                {otherNews.length > 0 ? otherNews.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/berita/${item.slug}`}
                    className="group flex items-start gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-3 leading-snug">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 mt-2 block">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </Link>
                )) : (
                  <p className="text-sm text-slate-500 italic">Belum ada berita lainnya.</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section: Content */}
          <article className="bg-white shadow-lg p-6 sm:p-10 rounded-xl">
            <header className="mb-8 border-b border-slate-100 pb-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-4">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {formatDate(news.created_at)}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                {news.title}
              </h1>
              {news.excerpt && (
                <p className="text-xl text-slate-600 italic border-l-4 border-emerald-400 pl-5">
                  {news.excerpt}
                </p>
              )}
            </header>
            
            <div className="prose prose-emerald prose-lg max-w-4xl mx-auto text-slate-700 leading-relaxed whitespace-pre-wrap">
              {news.content}
            </div>
          </article>

        </div>
      </main>

      <Footer logoName={content?.logo_name} kontak={kontak} />
    </div>
  )
}

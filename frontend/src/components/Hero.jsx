import { ArrowRight, Info, Calendar, Heart } from 'lucide-react'

export default function Hero({ heroTitle, heroSubtitle, heroBackground, sambutan }) {
  const bgStyle = heroBackground ? { backgroundImage: `url(${heroBackground})` } : {}

  return (
    <section id="beranda"
      className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white"
      style={bgStyle}>
      <div className="absolute inset-0 bg-emerald-950/85 z-10" />
      {!heroBackground && (
        <div className="absolute inset-0 opacity-10 z-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l40 40-40 40L0 40z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3Cpath d='M40 10l30 30-30 30-30-30z' fill='%23d4af37' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} />
      )}
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-800/40 border border-emerald-700/50 px-3.5 py-1.5 rounded-full text-amber-300 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Pendaftaran Santri Baru Dibuka!
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            {heroTitle}
          </h1>
          <p className="text-slate-200 text-base md:text-lg leading-relaxed max-w-2xl">{heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a href="#ppdb"
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#sejarah"
              className="bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-700/50 text-white px-8 py-3.5 rounded-xl font-semibold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
              Pelajari Profil <Info className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right - Sambutan card */}
        <div className="lg:col-span-5">
          <div className="bg-white/10 backdrop-blur-md text-slate-100 p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10 relative">
            <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 bg-amber-400 text-emerald-950 p-2.5 rounded-xl shadow-md hidden sm:block">
              <Heart className="w-5 h-5 fill-emerald-950" />
            </div>
            <h3 className="text-amber-300 font-bold text-xs uppercase tracking-widest mb-1.5">Sambutan Kepala Madrasah</h3>
            <h4 className="text-lg font-bold text-white mb-4">Hj. Maryam, S.Pd.I</h4>
            <div className="text-slate-200 text-xs md:text-sm leading-relaxed space-y-3 max-h-64 overflow-y-auto pr-2">
              {sambutan.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-6 pt-5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-300">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Bogor, Jawa Barat
              </span>
              <span className="font-semibold text-amber-300">Yayasan Ponpes Hikmatul Furqon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

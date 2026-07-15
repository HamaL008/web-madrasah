import { ArrowRight, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    const num = parseInt(target.replace(/\D/g, "")) || 0
    const suffix = target.replace(/[\d]/g, "")
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * num) + suffix)
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

const STATS = [
  { val: "350+", label: "Santri Aktif" },
  { val: "27+", label: "Tenaga Pendidik" },
  { val: "100%", label: "Kelulusan" },
  { val: "2012", label: "Tahun Berdiri" },
]

function StatItem({ val, label, started }) {
  const count = useCountUp(val, 1400, started)
  return (
    <div>
      <p className="text-2xl font-extrabold text-amber-300">{count || val}</p>
      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">{label}</p>
    </div>
  )
}

export default function Hero({ heroTitle, heroSubtitle, heroBackground }) {
  const statsRef = useRef(null)
  const [statsStarted, setStatsStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true) },
      { threshold: 0.5 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="beranda"
      className="relative flex items-center justify-center overflow-hidden bg-emerald-950"
      style={{ minHeight: "90vh" }}
    >
      {/* Pattern Overlay Background */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-emerald-950/65" />

      {/* Glow blobs */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

      {/* Content Container Split-Screen */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Kolom Kiri: Teks & CTA */}
          <div className="text-left text-white">

            {/* Judul Utama */}
            <h1 className="animate-fade-up-delay-1 text-5xl lg:text-6xl font-extrabold leading-tight mb-5 drop-shadow-lg">
              {heroTitle?.includes("Qur'ani") ? (
                <>
                  {heroTitle.split("Qur'ani")[0]}
                  <span className="text-amber-400">Qur'ani</span>
                  {heroTitle.split("Qur'ani")[1]}
                </>
              ) : (
                heroTitle
              )}
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up-delay-2 text-slate-200 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              {heroSubtitle}
            </p>

            {/* Stats */}
            <div ref={statsRef}
              className="animate-fade-up-delay-4 flex flex-wrap justify-start gap-8 pt-6 border-t border-white/15">
              {STATS.map(({ val, label }) => (
                <StatItem key={label} val={val} label={label} started={statsStarted} />
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Visual & Kartu Melayang */}
          <div className="relative animate-fade-in-scale w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative aspect-[4/5] rounded-[2rem] shadow-2xl overflow-hidden border-4 border-emerald-900/40">
              <img
                src={heroBackground || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"}
                alt="Madrasah"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-emerald-950/10 mix-blend-overlay" />
            </div>
          </div>

        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 100L60 88C120 76 240 52 360 46C480 40 600 52 720 58C840 64 960 64 1080 58C1200 52 1320 40 1380 34L1440 28V100H0Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  )
}
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function StatItem({ val, label, started }) {
  const [count, setCount] = useState("")
  useEffect(() => {
    if (!started) return
    const num = parseInt(val.toString().replace(/\D/g, "")) || 0
    const suffix = val.toString().replace(/\d/g, "")
    let t = null
    const step = (ts) => {
      if (!t) t = ts
      const p = Math.min((ts - t) / 1400, 1)
      setCount(Math.floor(p * num) + suffix)
      if (p < 1) requestAnimationFrame(step)
      else setCount(val)
    }
    requestAnimationFrame(step)
  }, [started, val])
  
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-6 md:p-8 min-w-[160px] sm:min-w-[180px] hover:-translate-y-2 hover:bg-white/15 transition-all duration-300">
      <p className="font-sans text-4xl sm:text-5xl font-extrabold text-amber-400 mb-2 drop-shadow-md">{count || val}</p>
      <p className="font-sans text-[11px] sm:text-xs text-emerald-100 uppercase tracking-widest font-bold">{label}</p>
    </div>
  )
}

export default function Hero({ heroTitle, heroSubtitle, heroBackground, sambutan, stats }) {
  const statsRef = useRef(null)
  const [started, setStarted] = useState(false)

  // Use exact number from database if available, else 0.
  const dynamicStats = [
    { val: stats?.students != null ? stats.students : "350+", label: "Santri Aktif" },
    { val: stats?.teachers != null ? stats.teachers : "27+",  label: "Tenaga Pendidik" },
    { val: "2025", label: "Tahun Berdiri" },
  ]

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="beranda" className="relative flex items-center justify-center overflow-hidden bg-emerald-900"
      style={{ minHeight: "90vh" }}>

      {heroBackground && (
        <img src={heroBackground} alt="hero" className="absolute inset-0 w-full h-full object-cover animate-fade-in-scale" />
      )}
      {!heroBackground && (
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-900/55 to-emerald-950/80" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl pointer-events-none animate-pulse-slow" />

      <div className="relative z-10 text-center text-white px-4 sm:px-8 max-w-5xl mx-auto py-28 w-full">
        <h1 className="animate-fade-up-delay-1 font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5 drop-shadow-lg">
          {heroTitle}
        </h1>

        <p className="animate-fade-up-delay-2 text-emerald-100 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          {heroSubtitle}
        </p>

        <div ref={statsRef} className="animate-fade-up-delay-4 flex flex-wrap justify-center gap-4 sm:gap-6 pt-8">
          {dynamicStats.map(({ val, label }) => (
            <StatItem key={label} val={val} label={label} started={started} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block translate-y-1">
          <path d="M0 80L60 68C120 56 240 32 360 26C480 20 600 32 720 40C840 48 960 52 1080 46C1200 40 1320 24 1380 16L1440 8V80H0Z" fill="#ffffff"/>
        </svg>
      </div>
    </section>
  )
}
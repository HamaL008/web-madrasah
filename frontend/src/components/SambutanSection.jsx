import { useEffect, useRef } from "react"

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target) }
      }),
      { threshold: 0.15 }
    )
    const el = ref.current
    if (el) { el.querySelectorAll(".reveal").forEach((r) => observer.observe(r)) }
    return () => observer.disconnect()
  }, [])
  return ref
}

export default function SambutanSection({ sambutan }) {
  const ref = useReveal()
  if (!sambutan) return null
  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Ilustrasi */}
          <div className="reveal rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-emerald-100 to-emerald-200 aspect-[4/3] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 rounded-full bg-emerald-300/60 mx-auto mb-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-emerald-600 font-semibold">Kepala Madrasah</p>
            </div>
          </div>

          {/* Sambutan */}
          <div className="reveal space-y-4" style={{transitionDelay:"0.15s"}}>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-1">Sambutan</p>
              <h3 className="text-xl font-extrabold text-emerald-950">Hj. Maryam, S.Pd.I</h3>
              <p className="text-sm text-emerald-600 font-medium">Kepala Madrasah Miftahul Ulum</p>
            </div>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3 max-h-60 overflow-y-auto pr-1">
              {sambutan.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
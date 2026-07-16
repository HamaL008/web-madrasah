import { useEffect, useState } from "react"
import {
  BookOpen, BookMarked, GraduationCap, Star, Layers,
  Lightbulb, Heart, Globe, Award, Users, School, ArrowRight
} from "lucide-react"
import api from "../api/axios"

const ICON_MAP = {
  BookOpen, BookMarked, GraduationCap, Star, Layers,
  Lightbulb, Heart, Globe, Award, Users, School,
}

const ACCENT_COLORS = [
  { bg: "bg-emerald-50",  icon: "text-emerald-700", badge: "text-amber-600 bg-amber-50 border-amber-200" },
  { bg: "bg-teal-50",     icon: "text-teal-700",    badge: "text-amber-600 bg-amber-50 border-amber-200" },
  { bg: "bg-green-50",    icon: "text-green-700",   badge: "text-amber-600 bg-amber-50 border-amber-200" },
]

export default function ProgramSection() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    api.get("/programs")
      .then((r) => setPrograms(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && programs.length === 0) return null

  return (
    <section id="program" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-2">Kurikulum Unggulan</p>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-emerald-950 mb-3">
            Program & Pendidikan
          </h2>
          <div className="mx-auto w-12 h-1 bg-amber-400 rounded-full mt-3" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((prog, i) => {
              const IconComp = ICON_MAP[prog.icon] || BookOpen
              
              return (
                <div key={prog.id} className="flex flex-col bg-madrasah-cream rounded-[2rem] p-8 shadow-sm border border-emerald-900/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 reveal reveal-scale relative overflow-hidden group">
                  {/* Dekorasi Card */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/60 transition-colors"></div>
                  
                  {/* Top: Icon & Badge */}
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-100 text-amber-700 text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-sm">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Unggulan
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="relative z-10 mb-8">
                    <h3 className="font-sans text-xl font-extrabold text-emerald-950 leading-snug mb-3">
                      {prog.title}
                    </h3>
                    {prog.description && (
                      <p className="text-sm text-emerald-900/70 leading-relaxed">
                        {prog.description}
                      </p>
                    )}
                  </div>

                  {/* Fokus & Unggulan */}
                  {prog.focus_points && prog.focus_points.length > 0 && (
                    <div className="relative z-10 mt-auto pt-6 border-t border-emerald-900/10">
                      <h4 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 mb-4">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Fokus & Keunggulan
                      </h4>
                      <ul className="space-y-3">
                        {prog.focus_points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <svg className="w-2.5 h-2.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-sm text-emerald-900/80 leading-snug">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
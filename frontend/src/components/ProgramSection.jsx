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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-2">Kurikulum Unggulan</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 mb-3">
            Program & Pendidikan
          </h2>
          <div className="mx-auto w-12 h-1 bg-amber-400 rounded-full mt-3" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((prog, i) => {
              const bgColors = ["bg-emerald-600", "bg-emerald-800", "bg-emerald-950"]
              const bgColor = bgColors[i % bgColors.length]
              
              const defaultImages = [
                "https://images.unsplash.com/photo-1609599006352-20c788d7520e?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
              ]
              const imgUrl = defaultImages[i % defaultImages.length]

              return (
                <div key={prog.id} className="flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer reveal reveal-scale">
                  {/* Bagian Atas (Gambar) */}
                  <div className="h-64 w-full overflow-hidden">
                    <img 
                      src={imgUrl} 
                      alt={prog.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Bagian Bawah (Blok Warna & Teks) */}
                  <div className={`${bgColor} flex flex-col p-6 flex-grow`}>
                    <h3 className="text-white text-lg font-bold leading-snug">
                      {prog.title}
                    </h3>
                    
                    {/* Pembatas Elastis */}
                    <div className="flex-grow"></div>
                    
                    {/* Tautan */}
                    <div className="mt-8 flex items-center gap-2 text-white/80 text-[11px] font-bold uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                      Pelajari detail <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
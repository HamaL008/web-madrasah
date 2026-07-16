import {
  CheckCircle, Users, GraduationCap, Award, BookOpen,
  ExternalLink, ShieldCheck, CreditCard, Image as ImageIcon,
  Briefcase, Info, X
} from "lucide-react"

const ICON_MAP = {
  Award, Users, ShieldCheck, BookOpen, CheckCircle, GraduationCap
}
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ProgramSection from "./ProgramSection"

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

function getInitials(nama) {
  return nama
    .replace(/^(ustadz|ustadzah|hj\.|h\.|kh\.)\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

const AVATAR_COLORS = [
  "from-emerald-600 to-emerald-900",
  "from-teal-600 to-emerald-800",
  "from-emerald-700 to-teal-900",
  "from-green-600 to-emerald-900",
]

function SectionHeader({ badge, badgeIcon: Icon, title, subtitle, dark = false }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${dark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-800'}`}>
          {Icon && <Icon className="w-3.5 h-3.5" />} {badge}
        </div>
      )}
      <h2 className={`font-sans text-3xl md:text-4xl font-extrabold mb-3 ${dark ? 'text-white' : 'text-emerald-950'}`}>{title}</h2>
      {subtitle && <p className={`text-sm leading-relaxed ${dark ? 'text-emerald-100/70' : 'text-slate-500'}`}>{subtitle}</p>}
    </div>
  )
}

function GaleriSection({ galeri, driveLegalitas }) {
  const navigate  = useNavigate()
  const [activecat, setActiveCat] = useState("Semua")
  const [selectedImage, setSelectedImage] = useState(null)
  const LIMIT = 3

  // Reset showAll saat ganti kategori
  const handleCat = (cat) => { setActiveCat(cat) }

  // Ambil kategori unik dari data, urut alfabetis
  const categories = ["Semua", ...[...new Set(galeri.map((g) => g.category).filter(Boolean))].sort()]

  const filtered  = activecat === "Semua" ? galeri : galeri.filter((g) => g.category === activecat)
  const displayed = filtered.slice(0, LIMIT)
  const hasMore   = filtered.length > LIMIT

  return (
    <section id="galeri" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Dokumentasi Kegiatan"
          badgeIcon={ImageIcon}
          title="Galeri Kegiatan Madrasah"
          subtitle="Sekilas momen berharga dari berbagai kegiatan dan aktivitas madrasah kami."
        />

        {galeri.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300 space-y-3">
            <ImageIcon className="w-12 h-12" />
            <p className="text-sm">Belum ada foto galeri.</p>
          </div>
        ) : (
          <>
            {categories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => handleCat(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      activecat === cat
                        ? "bg-emerald-900 text-white border-emerald-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-800"
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">Belum ada foto dalam kategori ini.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 lg:gap-6 mb-8">
                  {displayed.map((item, i) => (
                    <div key={item.id} 
                      onClick={() => item.image_url && setSelectedImage(item)}
                      className={`reveal reveal-scale group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${item.image_url ? 'cursor-pointer' : ''} ${i === 0 ? 'lg:col-span-2 lg:row-span-2 h-[350px] lg:h-[500px]' : 'h-[250px] lg:h-[238px]'}`}>
                      <div className="w-full h-full overflow-hidden bg-slate-100 relative">
                        {item.image_url
                          ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          : <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-800 to-emerald-950">
                              <ImageIcon className="w-12 h-12 text-emerald-600 mb-2" />
                            </div>
                        }
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end z-10">
                          {item.category && (
                            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full w-max mb-3">
                              {item.category}
                            </span>
                          )}
                          <h4 className="font-extrabold text-white text-lg lg:text-xl mb-1.5 line-clamp-1">{item.title}</h4>
                          {item.description && <p className="text-emerald-100/80 text-xs leading-relaxed line-clamp-2">{item.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tombol lihat semua ? halaman /galeri */}
                {hasMore && (
                  <div className="flex justify-center mb-12">
                    <button
                      onClick={() => navigate('/galeri')}
                      className="px-7 py-2.5 rounded-xl border border-emerald-200 text-emerald-800 text-sm font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-2"
                    >
                      Lihat Semua Foto ({galeri.length} Foto) <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {driveLegalitas && (
          <div className="bg-emerald-950 rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="font-extrabold text-white text-base flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" /> Legalitas & Perizinan Yayasan
              </h3>
              <p className="text-slate-400 text-xs max-w-lg leading-relaxed">
                Madrasah Miftahul Ulum beroperasi resmi di bawah Yayasan Pondok Pesantren Hikmatul Furqon. Seluruh berkas SK dapat diakses publik.
              </p>
            </div>
            <a href={driveLegalitas} target="_blank" rel="noopener noreferrer"
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 shrink-0 w-full md:w-auto justify-center transition-all">
              Lihat Dokumen Legalitas <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Image Modal Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm animate-fade-in" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center justify-center animate-fade-in-scale" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white hover:rotate-90 transition-all duration-300 p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.title} 
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl" 
            />
            <div className="mt-4 text-center">
              <h4 className="text-white font-extrabold text-xl">{selectedImage.title}</h4>
              {selectedImage.description && (
                <p className="text-slate-300 text-sm mt-2 max-w-2xl mx-auto">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default function ProfileSections({ sejarah, visi, misi, kurikulum, biaya, driveLegalitas, galeri, teachers = [] }) {
  const totalBiaya = biaya.reduce((acc, curr) => acc + curr.nominal, 0)

  return (
    <div className="w-full">

      <section id="sejarah" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="reveal reveal-left space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" /> Sejarah & Latar Belakang
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 leading-tight">
                Tumbuh Bersama Nilai-Nilai Islam
              </h2>
              <div className="text-slate-600 text-sm leading-7 space-y-4 text-justify">
                {sejarah.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
            <div className="reveal reveal-right lg:col-span-5 sticky top-24 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl shadow-2xl overflow-hidden delay-200">
              <div className="px-7 py-5 border-b border-emerald-700/50 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span className="text-amber-300 font-extrabold text-xs uppercase tracking-widest">Identitas Madrasah</span>
              </div>
              <div className="px-7 py-6 space-y-4">
                {[
                  ["Lembaga Naungan", "Yayasan Ponpes Hikmatul Furqon"],
                  ["Tahun Berdiri", "2025"],
                  ["Kurikulum Utama", "Pesantren Salaf"],
                  ["Lokasi", "Dusun Gondoarum, Jambearum, Patebon"],
                ].map(([label, val]) => (
                  <div key={label} className="flex flex-col sm:flex-row items-start border-b border-white/10 pb-3 last:border-0 last:pb-0 text-sm gap-1 sm:gap-4">
                    <span className="text-emerald-300 font-medium text-xs w-32 shrink-0 sm:mt-0.5">{label}</span>
                    <span className="font-bold text-left text-xs leading-relaxed">{val}</span>
                  </div>
                ))}
              </div>
              <div className="px-7 py-4 bg-emerald-950/60 border-t border-emerald-700/30">
                <p className="text-slate-400 text-xs italic text-center">"Mencetak generasi yang mutafaqqih fid din dan berwawasan iptek."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="visi-misi" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-madrasah-cream rounded-[2.5rem] p-8 md:p-14 lg:p-20 shadow-sm border border-emerald-900/5 relative overflow-hidden">
            {/* Dekorasi halus */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <span className="block text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-4 lg:mb-6 reveal reveal-left">
                VISI & PILAR UTAMA
              </span>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                {/* Kiri: Judul Visi */}
                <div className="lg:col-span-7 reveal reveal-left">
                  <h2 className="text-3xl md:text-5xl font-serif text-emerald-950 font-extrabold leading-[1.15]">
                    Membentuk Generasi yang Unggul & Berkarakter Mulia
                  </h2>
                </div>

                {/* Kanan: Kutipan Visi */}
                <div className="lg:col-span-5 reveal reveal-right space-y-6">
                  <p className="text-emerald-900/80 text-lg md:text-xl font-serif italic leading-relaxed">
                    "{visi}"
                  </p>
                  <div className="pt-2">
                    <a href="#sejarah" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-800 hover:text-amber-600 transition-colors">
                      PELAJARI PROFIL & SEJARAH KAMI <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bawah: 3 Pilar Utama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-8 md:mt-10 relative z-10 border-t border-emerald-900/10 pt-6 md:pt-8">
              {misi && misi.map((item, i) => {
                const pilar = typeof item === 'string' ? { title: item, description: '', icon: 'Award' } : item;
                const IconComp = ICON_MAP[pilar.icon] || Award;
                return (
                  <div key={i} className={`reveal reveal-scale delay-${((i % 3) + 1) * 100}`}>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-700 mb-5 shadow-sm">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-emerald-950 text-base mb-2">{pilar.title}</h4>
                    <p className="text-sm text-emerald-900/70 leading-relaxed">
                      {pilar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <ProgramSection />

      {teachers.length > 0 && (
        <section id="pendidik" className="py-24 relative overflow-hidden bg-emerald-900">
          {/* Background Decorations (Matching Hero) */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-emerald-900/55 to-emerald-950/80 pointer-events-none" />
          <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl pointer-events-none animate-pulse-slow" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="Tenaga Pendidik"
              badgeIcon={GraduationCap}
              title="Profil Ustadz & Ustadzah"
              subtitle="Para pendidik kami adalah sosok yang berdedikasi, berpengalaman, dan berkomitmen dalam membimbing generasi Qur'ani."
              dark={true}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mt-12">
              {teachers.map((guru, i) => (
                <div key={guru.id} className={`reveal reveal-scale group relative bg-white rounded-3xl shadow-lg hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] hover:-translate-y-2 transition-all duration-300 flex flex-col delay-${Math.min(i * 100 + 100, 400)} mt-12`}>
                  {/* Floating Avatar (overlapping top border) */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-lg border-4 border-emerald-950 bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                      {guru.image_url ? (
                        <img src={guru.image_url} alt={guru.nama} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-white font-extrabold text-3xl">{getInitials(guru.nama)}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="pt-20 pb-6 px-6 flex flex-col items-center text-center flex-1">
                    <h3 className="font-extrabold text-emerald-950 text-base leading-snug mb-2">{guru.nama}</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full mb-4">
                      <Briefcase className="w-3.5 h-3.5" /> {guru.jabatan}
                    </span>
                    
                    {guru.quotes && (
                      <p className="text-slate-500 text-xs italic mb-5 leading-relaxed">
                        "{guru.quotes}"
                      </p>
                    )}

                    <div className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-4 mt-auto group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-colors">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center justify-center gap-1.5 mb-3">
                        <BookOpen className="w-3.5 h-3.5" /> Mata Pelajaran
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {guru.mapel.split(",").map((m) => (
                          <span key={m} className="text-xs bg-white text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full font-medium shadow-sm">{m.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <GaleriSection galeri={galeri} driveLegalitas={driveLegalitas} />

    </div>
  )
}

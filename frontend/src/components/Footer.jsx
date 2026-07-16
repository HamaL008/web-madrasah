import { MapPin, Phone, Mail } from 'lucide-react'
import logoImg from '../assets/logo.png'

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  const navbar = document.querySelector('header')
  const offset = id === 'beranda'
    ? 0
    : el.getBoundingClientRect().top + window.scrollY - (navbar?.offsetHeight ?? 65)
  window.scrollTo({ top: offset, behavior: 'smooth' })
}

const NAV_LINKS = [
  ['Beranda',             'beranda'],
  ['Profil & Sejarah',    'sejarah'],
  ['Program',             'program'],
  ['Profil Pendidik',     'pendidik'],
  ['Galeri',              'galeri'],
  ['Berita & Pengumuman', 'berita'],
  ['Pendaftaran PPDB',    'ppdb'],
]

export default function Footer({ logoName, kontak }) {
  const year = new Date().getFullYear()
  return (
    <footer id="kontak" className="bg-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">

          {/* Brand */}
          <div className="reveal md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Logo Madrasah" className="w-12 h-12 object-contain" />
              <div>
                <p className="font-sans font-extrabold text-base text-white">{logoName}</p>
                <p className="font-serif text-[11px] text-emerald-300 tracking-wide">
                  Dusun Gondoarum · Jambearum - Patebon
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Menyelenggarakan pendidikan formal berbasis Islam salaf terpadu untuk melahirkan
              generasi rabbani berakhlak mulia, cerdas, dan mandiri.
            </p>
            {kontak.instagram && (
              <a
                href={`https://instagram.com/${kontak.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-300 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                @{kontak.instagram.replace('@', '')}
              </a>
            )}
          </div>

          {/* Navigasi */}
          <div className="reveal delay-200 md:col-span-3 space-y-4">
            <h4 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-amber-300">Navigasi</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(([label, id]) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-slate-400 hover:text-white text-xs transition-colors text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="reveal delay-300 md:col-span-4 space-y-4">
            <h4 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-amber-300">Hubungi Kami</h4>
            <ul className="space-y-3.5 text-xs text-slate-400">
              {kontak.alamat && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{kontak.alamat}</span>
                </li>
              )}
              {kontak.telepon && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{kontak.telepon}</span>
                </li>
              )}
              {kontak.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`mailto:${kontak.email}`} className="hover:text-white transition-colors">
                    {kontak.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {year} {logoName}. Hak Cipta Dilindungi.</p>
        </div>

      </div>
    </footer>
  )
}

import { MapPin, Phone, Mail, Shield, BookOpen } from 'lucide-react'

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (!target) return
  const navbar = document.querySelector('header')
  const headerHeight = navbar?.offsetHeight ?? 65
  const offset = id === 'beranda' ? 0 : target.getBoundingClientRect().top + window.scrollY - headerHeight
  window.scrollTo({ top: offset, behavior: 'smooth' })
}

export default function Footer({ logoName, kontak }) {
  const year = new Date().getFullYear()
  return (
    <footer id="kontak" className="bg-emerald-950 text-white pt-16 pb-8 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-emerald-900">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-400 p-2 rounded-xl text-emerald-950"><BookOpen className="w-5 h-5" /></div>
              <div>
                <span className="font-extrabold text-base block">{logoName}</span>
                <span className="text-[9px] text-emerald-300 font-semibold uppercase tracking-wider">YAYASAN PONPES HIKMATUL FURQON</span>
              </div>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">Menyelenggarakan pendidikan formal berbasis Islam salaf terpadu untuk melahirkan generasi rabbani berakhlak mulia.</p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-300">Navigasi Cepat</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {[['Beranda', 'beranda'], ['Profil & Sejarah', 'sejarah'], ['Visi & Misi', 'visi-misi'], ['Biaya Masuk', 'biaya'], ['Pendaftaran PPDB', 'ppdb']].map(([label, id]) => (
                <li key={label}>
                  <button onClick={() => scrollTo(id)} className="hover:text-white transition-colors text-left">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-300">Hubungi Kami</h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />{kontak.alamat}</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-amber-400 shrink-0" />{kontak.telepon}</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-amber-400 shrink-0" />{kontak.email}</li>
              <li className="flex items-center gap-3">
                <InstagramIcon className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`https://instagram.com/${kontak.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @{kontak.instagram.replace('@', '')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {year} {logoName}. Hak Cipta Dilindungi.</p>
          <a href="/admin" className="flex items-center gap-1 hover:text-amber-300 font-semibold transition-colors">
            <Shield className="w-3.5 h-3.5" /> Portal Admin
          </a>
        </div>
      </div>
    </footer>
  )
}

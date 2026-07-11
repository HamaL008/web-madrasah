import { useState, useEffect, useRef } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'

const navLinks = [
  { name: 'Beranda',     href: 'beranda' },
  { name: 'Profil',      href: 'sejarah' },
  { name: 'Visi & Misi', href: 'visi-misi' },
  { name: 'Biaya',       href: 'biaya' },
  { name: 'Galeri',      href: 'galeri' },
  { name: 'Kontak',      href: 'kontak' },
]

export default function Navbar({ logoName }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (id, closeMenu = false) => {
    if (closeMenu) setIsOpen(false)

    const target = document.getElementById(id)
    if (!target) return

    const headerHeight = headerRef.current?.offsetHeight ?? 65
    const targetTop = target.getBoundingClientRect().top + window.scrollY

    // Beranda → scroll ke paling atas, section lain → offset tepat di bawah navbar
    const offset = id === 'beranda' ? 0 : targetTop - headerHeight

    window.scrollTo({ top: offset, behavior: 'smooth' })
  }

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-emerald-950/95 backdrop-blur-md shadow-md py-3' : 'bg-emerald-950 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollToSection('beranda')} className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-2 rounded-xl text-emerald-950 shadow-md group-hover:scale-105 transition-transform duration-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-sm text-white tracking-wide group-hover:text-amber-300 transition-colors">
              {logoName}
            </span>
            <span className="text-[10px] text-emerald-300 font-medium tracking-wider">
              YAYASAN PONPES HIKMATUL FURQON
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="text-emerald-100 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('ppdb')}
            className="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            PPDB Online
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-emerald-100 p-1.5 rounded-lg hover:bg-emerald-900/40 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-x-0 bg-emerald-950/98 border-b border-emerald-900 backdrop-blur-lg transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-80 opacity-100 py-6' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        style={{ top: headerRef.current?.offsetHeight ?? 65 }}
      >
        <div className="px-4 space-y-4 flex flex-col">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href, true)}
              className="text-emerald-100 hover:text-amber-300 text-base font-semibold py-1.5 transition-colors text-left"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('ppdb', true)}
            className="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-5 py-2.5 rounded-xl text-center text-sm font-bold block w-full"
          >
            PPDB Online
          </button>
        </div>
      </div>
    </header>
  )
}

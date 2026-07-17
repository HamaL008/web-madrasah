import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../assets/logo.png'

const navLinks = [
  { name: 'Beranda',  href: 'beranda',   page: null },
  { name: 'Profil',   href: 'sejarah',   page: null },
  { name: 'Program',  href: 'program',   page: null },
  { name: 'Pendidik', href: 'pendidik',  page: null },
  { name: 'Galeri',   href: 'galeri',    page: null },
  { name: 'Berita',   href: 'berita',    page: null },
  { name: 'Kontak',   href: 'kontak',    page: null },
]

export default function Navbar({ logoName }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (id, closeMenu = false) => {
    if (closeMenu) setIsOpen(false)
    if (location.pathname !== '/') {
      navigate('/?scrollTo=' + id)
      return
    }
    const target = document.getElementById(id)
    if (!target) return
    const headerHeight = headerRef.current?.offsetHeight ?? 65
    const targetTop = target.getBoundingClientRect().top + window.scrollY
    const offset = id === 'beranda' ? 0 : targetTop - headerHeight
    window.scrollTo({ top: offset, behavior: 'smooth' })
  }

  const handleNav = (link, closeMenu = false) => {
    if (closeMenu) setIsOpen(false)
    if (link.page) { navigate(link.page); return }
    scrollToSection(link.href)
  }

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-300 bg-emerald-950/90 backdrop-blur-md border-b border-emerald-800/50 shadow-md ${
        scrolled ? 'py-3' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollToSection('beranda')} className="flex items-center gap-3 group">
          <img
            src={logoImg}
            alt="Logo Madrasah"
            className="w-11 h-11 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col text-left overflow-hidden">
            <span className="font-sans font-extrabold text-sm text-white tracking-wide group-hover:text-amber-300 transition-colors truncate">
              {logoName}
            </span>
            <span className="font-sans text-[10px] text-emerald-300 font-semibold tracking-wider uppercase hidden sm:block truncate">
              Dusun Gondoarum · Jambearum - Patebon
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNav(link)}
              className="font-sans text-emerald-100 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('ppdb')}
            className="font-sans bg-amber-400 hover:bg-amber-500 text-emerald-950 px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            Pendaftaran Online
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
              onClick={() => handleNav(link, true)}
              className="text-emerald-100 hover:text-amber-300 text-base font-semibold py-1.5 transition-colors text-left"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('ppdb', true)}
            className="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-5 py-2.5 rounded-xl text-center text-sm font-bold block w-full"
          >
            Pendaftaran Online
          </button>
        </div>
      </div>
    </header>
  )
}

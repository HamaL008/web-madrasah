import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useRevealObserver } from '../hooks/useReveal'
import RunningText from '../components/RunningText'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProfileSections from '../components/ProfileSections'
import NewsSection from '../components/NewsSection'
import BiayaSection from '../components/BiayaSection'
import SambutanSection from '../components/SambutanSection'
import PPDBForm from '../components/PPDBForm'
import Footer from '../components/Footer'
import api from '../api/axios'

export default function Home() {
  useRevealObserver()
  const [content, setContent]   = useState(null)
  const [galeri, setGaleri]     = useState([])
  const [teachers, setTeachers] = useState([])
  const [stats, setStats]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const location = useLocation()

  useEffect(() => {
    Promise.all([
      api.get('/content'),
      api.get('/gallery'),
      api.get('/teachers'),
      api.get('/stats'),
    ])
      .then(([contentRes, galleryRes, teacherRes, statsRes]) => {
        setContent(contentRes.data)
        setGaleri(galleryRes.data ?? [])
        setTeachers(teacherRes.data ?? [])
        setStats(statsRes.data ?? null)
      })
      .catch((err) => console.error('Gagal memuat konten:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
    const params = new URLSearchParams(location.search)
    const scrollTo = params.get('scrollTo')
    if (scrollTo) {
      setTimeout(() => {
        const target = document.getElementById(scrollTo)
        if (target) {
          const headerHeight = 65
          const targetTop = target.getBoundingClientRect().top + window.scrollY
          const offset = scrollTo === 'beranda' ? 0 : targetTop - headerHeight
          window.scrollTo({ top: offset, behavior: 'smooth' })
        }
      }, 500)
    }
  }, [loading, location.search])

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Memuat Halaman Profil...</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center text-white">
        <p className="text-sm text-emerald-300">Gagal memuat konten. Pastikan backend berjalan.</p>
      </div>
    )
  }

  const kontak = {
    alamat: content.alamat, telepon: content.telepon,
    email: content.email, whatsapp: content.whatsapp, instagram: content.instagram,
  }

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <RunningText text={content.announcement} />
      <Navbar logoName={content.logo_name} />
      <main className="flex-1">
        <Hero
          heroTitle={content.hero_title}
          heroSubtitle={content.hero_subtitle}
          heroBackground={content.hero_background}
          sambutan={content.sambutan}
          stats={stats}
        />
        <SambutanSection 
          sambutan={content.sambutan} 
          sambutanImage={content.sambutan_image}
        />
        <ProfileSections
          sejarah={content.sejarah}
          visi={content.visi}
          misi={content.misi}
          kurikulum={content.kurikulum}
          biaya={content.biaya}
          driveLegalitas={content.drive_legalitas}
          galeri={galeri}
          teachers={teachers}
        />
        <NewsSection />
        <PPDBForm panitiaWa={content.whatsapp} biaya={content.biaya ?? []} />
      </main>
      <Footer logoName={content.logo_name} kontak={kontak} />
    </div>
  )
}

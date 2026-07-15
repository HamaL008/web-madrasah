import { useState, useEffect } from 'react'
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
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/content'),
      api.get('/gallery'),
      api.get('/teachers'),
    ])
      .then(([contentRes, galleryRes, teacherRes]) => {
        setContent(contentRes.data)
        setGaleri(galleryRes.data ?? [])
        setTeachers(teacherRes.data ?? [])
      })
      .catch((err) => console.error('Gagal memuat konten:', err))
      .finally(() => setLoading(false))
  }, [])

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
    <div className="flex flex-col min-h-screen w-full max-w-[100vw]">
      <RunningText text={content.announcement} />
      <Navbar logoName={content.logo_name} />
      <main className="flex-1">
        <Hero
          heroTitle={content.hero_title}
          heroSubtitle={content.hero_subtitle}
          heroBackground={content.hero_background}
          sambutan={content.sambutan}
        />
        <SambutanSection sambutan={content.sambutan} />
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

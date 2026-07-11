import { useState, useEffect } from 'react'
import RunningText from '../components/RunningText'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProfileSections from '../components/ProfileSections'
import PPDBForm from '../components/PPDBForm'
import Footer from '../components/Footer'
import api from '../api/axios'

export default function Home() {
  const [content, setContent] = useState(null)
  const [galeri, setGaleri]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/content'),
      api.get('/gallery'),
    ])
      .then(([contentRes, galleryRes]) => {
        setContent(contentRes.data)
        setGaleri(galleryRes.data ?? [])
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
    <div className="flex flex-col min-h-screen">
      <RunningText text={content.announcement} />
      <Navbar logoName={content.logo_name} />
      <main className="flex-1">
        <Hero
          heroTitle={content.hero_title}
          heroSubtitle={content.hero_subtitle}
          heroBackground={content.hero_background}
          sambutan={content.sambutan}
        />
        <ProfileSections
          sejarah={content.sejarah}
          visi={content.visi}
          misi={content.misi}
          kurikulum={content.kurikulum}
          biaya={content.biaya}
          driveLegalitas={content.drive_legalitas}
          galeri={galeri}
        />
        <PPDBForm panitiaWa={content.whatsapp} />
      </main>
      <Footer logoName={content.logo_name} kontak={kontak} />
    </div>
  )
}

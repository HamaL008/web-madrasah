import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, UserCheck, Users, Edit,
  LogOut, Eye, BookOpen, Check, AlertCircle, Menu, X, Settings, Images
} from 'lucide-react'
import api from '../../api/axios'
import PanelOverview from './panels/PanelOverview'
import PanelPPDB from './panels/PanelPPDB'
import PanelDatabase from './panels/PanelDatabase'
import PanelContent from './panels/PanelContent'
import PanelPPDBSetting from './panels/PanelPPDBSetting'
import PanelGallery from './panels/PanelGallery'

const navItems = [
  { key: 'overview',      label: 'Ringkasan Data',      icon: LayoutDashboard },
  { key: 'ppdb',          label: 'Pendaftar PPDB',       icon: UserCheck },
  { key: 'ppdb-setting',  label: 'Periode PPDB',         icon: Settings },
  { key: 'gallery',       label: 'Kelola Galeri',        icon: Images },
  { key: 'database',      label: 'Database Internal',    icon: Users },
  { key: 'content',       label: 'Kelola Konten Web',    icon: Edit },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState('overview')
  const [pendingCount, setPendingCount] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification((p) => ({ ...p, show: false })), 3000)
  }

  useEffect(() => {
    api.get('/admin/registrants?status=Menunggu')
      .then((res) => setPendingCount(res.data.total ?? res.data.data?.length ?? 0))
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    try { await api.post('/admin/logout') } catch {}
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const selectPanel = (key) => {
    setActivePanel(key)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-emerald-900/50 flex items-center gap-3 shrink-0">
        <div className="bg-amber-400 p-2 rounded-xl text-emerald-950 shadow">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-extrabold text-sm tracking-wide">Portal Admin</h2>
          <p className="text-[10px] text-emerald-300 font-medium tracking-wider">MIFTAHUL ULUM</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => selectPanel(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activePanel === key
                ? 'bg-amber-400 text-emerald-950 font-bold'
                : 'text-slate-300 hover:bg-emerald-900 hover:text-white'
            }`}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {key === 'ppdb' && pendingCount > 0 && (
              <span className="ml-auto bg-red-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-emerald-900/50 space-y-3 shrink-0">
        <a href="/"
          className="w-full flex items-center justify-center gap-2 border border-emerald-800 hover:bg-emerald-900 text-emerald-100 py-2.5 rounded-xl text-xs font-semibold">
          <Eye className="w-4 h-4" /> Halaman Utama
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all">
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 animate-fade-in ${
          notification.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success'
            ? <Check className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {notification.message}
        </div>
      )}

      {/* ── MOBILE TOP BAR ── */}
      <header className="md:hidden sticky top-0 z-40 bg-emerald-950 border-b border-emerald-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-400 p-1.5 rounded-lg text-emerald-950">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-xs text-white leading-tight">Portal Admin</p>
            <p className="text-[9px] text-emerald-300 font-medium uppercase tracking-wider">Miftahul Ulum</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Active panel label */}
          <span className="text-amber-300 text-xs font-bold">
            {navItems.find((n) => n.key === activePanel)?.label}
          </span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-1.5 rounded-lg hover:bg-emerald-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-72 z-40 bg-emerald-950 text-white flex flex-col transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <SidebarContent />
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 bg-emerald-950 text-white flex-col shrink-0 border-r border-emerald-900 shadow-xl">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {activePanel === 'overview'      && <PanelOverview onNavigate={selectPanel} notify={triggerNotification} />}
          {activePanel === 'ppdb'          && <PanelPPDB notify={triggerNotification} />}
          {activePanel === 'ppdb-setting'  && <PanelPPDBSetting notify={triggerNotification} />}
          {activePanel === 'gallery'       && <PanelGallery notify={triggerNotification} />}
          {activePanel === 'database'      && <PanelDatabase notify={triggerNotification} />}
          {activePanel === 'content'       && <PanelContent notify={triggerNotification} />}
        </main>
      </div>
    </div>
  )
}

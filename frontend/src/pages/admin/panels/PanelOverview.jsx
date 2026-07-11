import { useState, useEffect } from 'react'
import { UserCheck, Users, Award, FileSpreadsheet } from 'lucide-react'
import api from '../../../api/axios'

export default function PanelOverview({ onNavigate }) {
  const [stats, setStats] = useState({ registrants: 0, pending: 0, students: 0, teachers: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/admin/registrants'),
      api.get('/admin/students'),
      api.get('/admin/teachers'),
    ]).then(([regRes, stuRes, teachRes]) => {
      const regs = regRes.data.data ?? regRes.data
      setStats({
        registrants: regRes.data.total ?? regs.length,
        pending: Array.isArray(regs) ? regs.filter((r) => r.status === 'Menunggu').length : 0,
        students: stuRes.data.length,
        teachers: teachRes.data.length,
      })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Pendaftar PPDB', value: `${stats.registrants} Santri`, sub: `${stats.pending} Menunggu Verifikasi`, icon: UserCheck, subColor: 'text-amber-600 bg-amber-50' },
    { label: 'Santri Aktif Terdaftar', value: `${stats.students} Santri`, sub: 'Di dalam Database Internal', icon: Users, subColor: 'text-emerald-700 bg-emerald-50' },
    { label: 'Total Ustadz/Ustadzah', value: `${stats.teachers} Guru`, sub: 'Pendidik & Staf Yayasan', icon: Award, subColor: 'text-blue-700 bg-blue-50' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">Ringkasan Data Madrasah</h1>
        <p className="text-slate-500 text-xs mt-1">Status dan statistik operasional Madrasah Miftahul Ulum.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map(({ label, value, sub, icon: Icon, subColor }) => (
          <div key={label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
              <p className="text-3xl font-extrabold text-emerald-950">{value}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${subColor}`}>{sub}</span>
            </div>
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl"><Icon className="w-7 h-7" /></div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-6 rounded-3xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Butuh Laporan Arsip?</h3>
          <p className="text-emerald-200 text-xs mt-1">Unduh seluruh data ke format Excel (.xlsx) untuk arsip fisik.</p>
        </div>
        <button onClick={() => onNavigate('database')}
          className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0">
          <FileSpreadsheet className="w-4 h-4" /> Buka Database & Ekspor
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Plus, Trash2, FileSpreadsheet } from 'lucide-react'
import api from '../../../api/axios'

async function exportToExcel(data, fields, sheetName, fileName) {
  const { default: XLSX } = await import('xlsx')
  const ws = XLSX.utils.json_to_sheet(data.map((item, i) => {
    const row = { 'No': i + 1 }
    fields.forEach(([key, label]) => { row[label] = item[key] })
    return row
  }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, fileName)
}

export default function PanelDatabase({ notify }) {
  const [tab, setTab] = useState('students')
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [newStudent, setNewStudent] = useState({ nisn: '', nama: '', kelas: '', alamat: '' })
  const [newTeacher, setNewTeacher] = useState({ nuptk: '', nama: '', mapel: '', jabatan: '' })
  const [err, setErr] = useState('')

  useEffect(() => {
    api.get('/admin/students').then((r) => setStudents(r.data)).catch(() => {})
    api.get('/admin/teachers').then((r) => setTeachers(r.data)).catch(() => {})
  }, [])

  const addStudent = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const res = await api.post('/admin/students', newStudent)
      setStudents((p) => [...p, res.data])
      setNewStudent({ nisn: '', nama: '', kelas: '', alamat: '' })
      notify('Santri berhasil ditambahkan.')
    } catch (err) {
      setErr(err.response?.data?.message ?? Object.values(err.response?.data?.errors ?? {})[0]?.[0] ?? 'Gagal.')
    }
  }

  const deleteStudent = async (id) => {
    if (!confirm('Hapus santri ini?')) return
    await api.delete(`/admin/students/${id}`)
    setStudents((p) => p.filter((s) => s.id !== id))
    notify('Santri dihapus.')
  }

  const addTeacher = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const res = await api.post('/admin/teachers', newTeacher)
      setTeachers((p) => [...p, res.data])
      setNewTeacher({ nuptk: '', nama: '', mapel: '', jabatan: '' })
      notify('Pendidik berhasil ditambahkan.')
    } catch (err) {
      setErr(err.response?.data?.message ?? Object.values(err.response?.data?.errors ?? {})[0]?.[0] ?? 'Gagal.')
    }
  }

  const deleteTeacher = async (id) => {
    if (!confirm('Hapus pendidik ini?')) return
    await api.delete(`/admin/teachers/${id}`)
    setTeachers((p) => p.filter((t) => t.id !== id))
    notify('Pendidik dihapus.')
  }

  const inputCls = 'flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-emerald-600 text-xs'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Database Internal</h1>
        <p className="text-slate-500 text-xs mt-1">Kelola data santri aktif dan pendidik madrasah.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['students', 'Santri Aktif'], ['teachers', 'Ustadz/Ustadzah']].map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); setErr('') }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === key ? 'bg-emerald-800 text-white shadow' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {err && <p className="text-xs text-red-600 font-semibold">{err}</p>}

      {tab === 'students' && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah Santri Baru</h3>
            <form onSubmit={addStudent} className="flex flex-wrap gap-3">
              {[['nisn', 'NISN'], ['nama', 'Nama Lengkap'], ['kelas', 'Kelas'], ['alamat', 'Alamat']].map(([name, ph]) => (
                <input key={name} name={name} value={newStudent[name]} onChange={(e) => setNewStudent((p) => ({ ...p, [name]: e.target.value }))}
                  placeholder={ph} className={inputCls} required />
              ))}
              <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </form>
          </div>
          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-700">Total: {students.length} santri</span>
              <button onClick={async () => { await exportToExcel(students, [['nisn','NISN'],['nama','Nama'],['kelas','Kelas'],['alamat','Alamat']], 'Santri Aktif', `Santri_Aktif_${new Date().getFullYear()}.xlsx`); notify('Excel diunduh.') }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Ekspor
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>{['NISN','Nama','Kelas','Alamat','Aksi'].map(h => <th key={h} className="p-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono">{s.nisn}</td>
                      <td className="p-3 font-semibold">{s.nama}</td>
                      <td className="p-3">{s.kelas}</td>
                      <td className="p-3 text-slate-500">{s.alamat}</td>
                      <td className="p-3">
                        <button onClick={() => deleteStudent(s.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'teachers' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah Pendidik</h3>
            <form onSubmit={addTeacher} className="flex flex-wrap gap-3">
              {[['nuptk', 'NUPTK/NIP'], ['nama', 'Nama Lengkap'], ['mapel', 'Mata Pelajaran'], ['jabatan', 'Jabatan']].map(([name, ph]) => (
                <input key={name} name={name} value={newTeacher[name]} onChange={(e) => setNewTeacher((p) => ({ ...p, [name]: e.target.value }))}
                  placeholder={ph} className={inputCls} required />
              ))}
              <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-700">Total: {teachers.length} pendidik</span>
              <button onClick={async () => { await exportToExcel(teachers, [['nuptk','NUPTK'],['nama','Nama'],['mapel','Mapel'],['jabatan','Jabatan']], 'Pendidik', `Pendidik_${new Date().getFullYear()}.xlsx`); notify('Excel diunduh.') }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Ekspor
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>{['NUPTK','Nama','Mata Pelajaran','Jabatan','Aksi'].map(h => <th key={h} className="p-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono">{t.nuptk}</td>
                      <td className="p-3 font-semibold">{t.nama}</td>
                      <td className="p-3">{t.mapel}</td>
                      <td className="p-3">{t.jabatan}</td>
                      <td className="p-3">
                        <button onClick={() => deleteTeacher(t.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Plus, Trash2, FileSpreadsheet, X, UploadCloud, Image as ImageIcon, Pencil, Users, GraduationCap } from 'lucide-react'
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

function DeleteModal({ isOpen, onClose, onConfirm, title = "Apakah Anda yakin ingin menghapus data ini?", subtitle = "Aksi ini tidak dapat dibatalkan." }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex-1">
            Batal
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm transition-colors flex-1">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

function Pagination({ current, total, onPageChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-slate-100 bg-slate-50">
      <button disabled={current === 1} onClick={() => onPageChange(current - 1)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">Prev</button>
      {Array.from({length: total}).map((_, i) => (
        <button key={i} onClick={() => onPageChange(i + 1)} className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors ${current === i + 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
          {i + 1}
        </button>
      ))}
      <button disabled={current === total} onClick={() => onPageChange(current + 1)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors">Next</button>
    </div>
  )
}

export default function PanelDatabase({ notify }) {
  const [tab, setTab] = useState('students')
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [newStudent, setNewStudent] = useState({ nisn: '', nama: '', kelas: '', alamat: '' })
  const [newTeacher, setNewTeacher] = useState({ nuptk: '', nama: '', mapel: '', jabatan: '', quotes: '' })
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [editTeacherId, setEditTeacherId] = useState(null)
  const [teacherImage, setTeacherImage] = useState(null)
  const [teacherImagePreview, setTeacherImagePreview] = useState(null)
  const [err, setErr] = useState('')
  
  const [deleteTarget, setDeleteTarget] = useState(null)
  
  const [studentPage, setStudentPage] = useState(1)
  const [teacherPage, setTeacherPage] = useState(1)
  const LIMIT = 10

  const paginatedStudents = students.slice((studentPage - 1) * LIMIT, studentPage * LIMIT)
  const totalStudentPages = Math.ceil(students.length / LIMIT)

  const paginatedTeachers = teachers.slice((teacherPage - 1) * LIMIT, teacherPage * LIMIT)
  const totalTeacherPages = Math.ceil(teachers.length / LIMIT)

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

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const { id, type } = deleteTarget
    try {
      if (type === 'student') {
        await api.delete(`/admin/students/${id}`)
        setStudents((p) => p.filter((s) => s.id !== id))
        notify('Santri dihapus.')
        const newTotal = Math.ceil((students.length - 1) / LIMIT)
        if (studentPage > newTotal && newTotal > 0) setStudentPage(newTotal)
      } else {
        await api.delete(`/admin/teachers/${id}`)
        setTeachers((p) => p.filter((t) => t.id !== id))
        notify('Pendidik dihapus.')
        const newTotal = Math.ceil((teachers.length - 1) / LIMIT)
        if (teacherPage > newTotal && newTotal > 0) setTeacherPage(newTotal)
      }
    } catch (e) {
      notify('Gagal menghapus data.', 'error')
    }
    setDeleteTarget(null)
  }

  const saveTeacher = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const fd = new FormData()
      Object.entries(newTeacher).forEach(([k, v]) => fd.append(k, v || ''))
      if (teacherImage) fd.append('image', teacherImage)

      if (editTeacherId) {
        const res = await api.post(`/admin/teachers/${editTeacherId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setTeachers((p) => p.map((t) => (t.id === editTeacherId ? res.data : t)))
        notify('Data pendidik diperbarui.')
      } else {
        const res = await api.post('/admin/teachers', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setTeachers((p) => [...p, res.data])
        notify('Pendidik berhasil ditambahkan.')
      }
      closeTeacherModal()
    } catch (err) {
      setErr(err.response?.data?.message ?? Object.values(err.response?.data?.errors ?? {})[0]?.[0] ?? 'Gagal.')
    }
  }

  const openEditTeacherModal = (t) => {
    setEditTeacherId(t.id)
    setNewTeacher({ nuptk: t.nuptk, nama: t.nama, mapel: t.mapel, jabatan: t.jabatan, quotes: t.quotes || '' })
    setTeacherImagePreview(t.image_url || null)
    setTeacherImage(null)
    setShowTeacherModal(true)
  }

  const closeTeacherModal = () => {
    setShowTeacherModal(false)
    setEditTeacherId(null)
    setNewTeacher({ nuptk: '', nama: '', mapel: '', jabatan: '', quotes: '' })
    setTeacherImage(null)
    setTeacherImagePreview(null)
    setErr('')
  }

  const handleTeacherImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return setErr('Ukuran gambar maksimal 2MB.')
    setErr('')
    setTeacherImage(file)
    setTeacherImagePreview(URL.createObjectURL(file))
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
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                          <Users className="w-10 h-10 text-slate-300" />
                          <p className="text-sm">Belum ada data santri. Silakan tambah data baru.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono">{s.nisn}</td>
                        <td className="p-3 font-semibold">{s.nama}</td>
                        <td className="p-3">{s.kelas}</td>
                        <td className="p-3 text-slate-500">{s.alamat}</td>
                        <td className="p-3">
                          <button onClick={() => setDeleteTarget({ id: s.id, type: 'student' })} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination current={studentPage} total={totalStudentPages} onPageChange={setStudentPage} />
          </div>
        </div>
      )}

      {tab === 'teachers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 gap-3">
              <span className="text-sm font-bold text-slate-700">Total: {teachers.length} pendidik</span>
              <div className="flex gap-2">
                <button onClick={async () => { await exportToExcel(teachers, [['nuptk','NUPTK'],['nama','Nama'],['mapel','Mapel'],['jabatan','Jabatan']], 'Pendidik', `Pendidik_${new Date().getFullYear()}.xlsx`); notify('Excel diunduh.') }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Ekspor
                </button>
                <button onClick={() => setShowTeacherModal(true)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Tambah Pendidik
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>{['NUPTK','Nama','Mata Pelajaran','Jabatan','Aksi'].map(h => <th key={h} className="p-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                          <GraduationCap className="w-10 h-10 text-slate-300" />
                          <p className="text-sm">Belum ada data ustadz/ustadzah. Silakan tambah data baru.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedTeachers.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono">{t.nuptk}</td>
                        <td className="p-3 font-semibold">{t.nama}</td>
                        <td className="p-3">{t.mapel}</td>
                        <td className="p-3">{t.jabatan}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEditTeacherModal(t)} className="text-amber-500 hover:text-amber-700 p-1.5 rounded-lg hover:bg-amber-50">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteTarget({ id: t.id, type: 'teacher' })} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination current={teacherPage} total={totalTeacherPages} onPageChange={setTeacherPage} />
          </div>
        </div>
      )}

      {/* Modal Tambah Pendidik */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-sm">{editTeacherId ? 'Edit Data Pendidik' : 'Tambah Pendidik Baru'}</h3>
              <button onClick={closeTeacherModal} className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-md border border-slate-200 shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-semibold">{err}</div>}
              <form id="teacherForm" onSubmit={saveTeacher} className="space-y-4">
                {/* Upload Foto Dropzone */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">Foto Profil (Opsional, max 2MB)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-emerald-500 transition-colors group overflow-hidden relative">
                    {teacherImagePreview ? (
                      <img src={teacherImagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <UploadCloud className="w-6 h-6 mb-2" />
                        <p className="text-xs font-semibold">Klik untuk unggah foto</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleTeacherImage} />
                  </label>
                </div>
                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[['nuptk', 'NUPTK/NIP'], ['nama', 'Nama Lengkap'], ['mapel', 'Mata Pelajaran'], ['jabatan', 'Jabatan']].map(([name, label]) => (
                    <div key={name}>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
                      <input name={name} value={newTeacher[name]} onChange={(e) => setNewTeacher((p) => ({ ...p, [name]: e.target.value }))}
                        className={inputCls} required />
                    </div>
                  ))}
                </div>
                {/* Textarea Quotes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Quotes / Pesan Singkat</label>
                  <textarea name="quotes" value={newTeacher.quotes} onChange={(e) => setNewTeacher((p) => ({ ...p, quotes: e.target.value }))}
                    className={`${inputCls} resize-none h-20`} placeholder="Pesan inspiratif dari guru..." />
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={closeTeacherModal} className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">Batal</button>
              <button type="submit" form="teacherForm" className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 shadow-sm transition-colors flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> {editTeacherId ? 'Simpan Perubahan' : 'Simpan Pendidik'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={confirmDelete} 
      />
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import api from '../../api/axios'
import logoImg from '../../assets/logo.png'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { username, password })
      localStorage.setItem('admin_token', res.data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-emerald-950 via-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-6 relative z-10">
        <img src={logoImg} alt="Logo Madrasah" className="w-20 h-20 object-contain mx-auto" />
        <div>
          <h1 className="font-sans text-xl md:text-2xl font-extrabold text-emerald-950">Portal Administrator</h1>
          <p className="font-serif text-slate-500 text-xs mt-1">Madrasah Diniyyah Miftahul Ulum</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/40 p-3.5 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold text-left">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-700 text-xs md:text-sm"
              required />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-700 text-xs md:text-sm"
              required />
          </div>
          <button type="submit" disabled={loading}
            className={`w-full text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900 hover:scale-[1.01]'}`}>
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>

        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between">
          <span>Demo: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold">admin</code> / <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold">admin123</code></span>
          <a href="/" className="text-emerald-800 font-bold hover:underline">Halaman Utama</a>
        </div>
      </div>
    </main>
  )
}

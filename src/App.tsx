import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { AuthGuard } from './components/auth/AuthGuard'
import { Home } from './pages/Home'
import { HandLab } from './pages/HandLab'
import { ClimbDay } from './pages/ClimbDay'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGuard>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hand-lab" element={<HandLab />} />
            <Route path="/climb-day" element={<ClimbDay />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthGuard>
      </AuthProvider>
    </BrowserRouter>
  )
}

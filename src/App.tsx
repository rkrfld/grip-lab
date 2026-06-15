import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { AuthGuard } from './components/auth/AuthGuard'
import { Home } from './pages/Home'
import { HandLab } from './pages/HandLab'
import { ClimbDay } from './pages/ClimbDay'
import { WarmUp } from './pages/ClimbDay/WarmUp'
import { Session } from './pages/ClimbDay/Session'
import { CoolDown } from './pages/ClimbDay/CoolDown'
import { Insights } from './pages/ClimbDay/Insights'
import { Onboarding } from './pages/Onboarding'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGuard>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/hand-lab" element={<HandLab />} />
            <Route path="/climb-day" element={<ClimbDay />} />
            <Route path="/climb-day/warmup" element={<WarmUp />} />
            <Route path="/climb-day/session" element={<Session />} />
            <Route path="/climb-day/cooldown" element={<CoolDown />} />
            <Route path="/climb-day/insights" element={<Insights />} />
            <Route path="*" element={<Navigate to="/climb-day" replace />} />
          </Routes>
        </AuthGuard>
      </AuthProvider>
    </BrowserRouter>
  )
}

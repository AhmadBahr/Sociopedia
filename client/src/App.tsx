import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const token = useSelector((s: RootState) => s.auth.token)
  // user available via Header

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App

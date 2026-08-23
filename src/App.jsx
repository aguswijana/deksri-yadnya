import { Routes, Route } from 'react-router-dom'
import Storefront from './pages/Storefront'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import OrderHistory from './pages/OrderHistory'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/lupa-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/riwayat" element={<OrderHistory />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }     from "./context/AuthContext";
import ProtectedRoute       from "./components/layout/ProtectedRoute";
import LandingPage          from "./pages/LandingPage";
import LoginPage            from "./pages/LoginPage";
import RegisterPage         from "./pages/RegisterPage";
import ReviewPage           from "./pages/ReviewPage";
import HistoryPage          from "./pages/HistoryPage";
import ReviewDetailPage     from "./pages/ReviewDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/review" element={
            <ProtectedRoute><ReviewPage /></ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute><HistoryPage /></ProtectedRoute>
          } />
          <Route path="/history/:id" element={
            <ProtectedRoute><ReviewDetailPage /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
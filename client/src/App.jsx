import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Navbar from "./components/layout/Navbar"
import HomePage from "./pages/LoginPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ListingsPage from "./pages/ListingsPage"
import ListingDetailPage from "./pages/ListingDetailPage"
import ProfilePage from "./pages/ProfilePage"
import MyListingsPage from "./pages/MyListingsPage"
import SessionsPage from "./pages/SessionsPage"
import ReviewsPage from "./pages/ReviewsPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <ProtectedRoute>
                    <MyListingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sessions"
                element={
                  <ProtectedRoute>
                    <SessionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reviews"
                element={
                  <ProtectedRoute>
                    <ReviewsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
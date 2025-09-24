import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Navbar from "./components/layout/Navbar"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import HomePage from "./pages/LoginPage"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import ListingsPage from "./pages/ListingsPage"
import ListingDetailPage from "./pages/ListingDetailPage"
import ListingForm from "./components/listings/ListingForm"
import MyListingsPage from "./pages/MyListingsPage"
import SessionsPage from "./pages/SessionsPage"
import ReviewsPage from "./pages/ReviewsPage"
import ProfilePage from "./pages/ProfilePage"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />

            <Route
              path="/create-listing"
              element={
                <ProtectedRoute>
                  <ListingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-listing/:id"
              element={
                <ProtectedRoute>
                  <ListingForm />
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
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
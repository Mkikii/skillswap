import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ProfilePage from './pages/ProfilePage';
import CreateListingPage from './pages/CreateListingPage';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';

function App() {
  const [user, setUser] = useState(null);

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    fetch('/logout', {
      method: 'POST',
    }).then(() => {
      setUser(null);
    });
  }

  return (
    <BrowserRouter>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/create-listing" element={<CreateListingPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
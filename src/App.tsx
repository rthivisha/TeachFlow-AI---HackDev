import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Route Pages
import HomePage from './pages/Home'
import DiscoverPage from './pages/Discover'
import ResultsPage from './pages/Results'
import ContactPage from './pages/Contact'
import FAQPage from './pages/FAQ'

// Route Wrapper
import ProtectedRoute from './router/ProtectedRoute'

export function App() {
  return (
    <Router>
      <Routes>
        {/* Unprotected Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />

        {/* Discovery & Workspace Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App

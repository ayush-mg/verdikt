import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SubmitWork from './pages/SubmitWork.jsx'
import JudgeQueue from './pages/JudgeQueue.jsx'
import VerdictForm from './pages/VerdictForm.jsx'
import FeedbackReveal from './pages/FeedbackReveal.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Profile from './pages/Profile.jsx'
import SubmissionDetail from './pages/SubmissionDetail.jsx'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<Navigate to="/login" />} />
          {/* Protected */}
          <Route path="/"                 element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/submit"           element={<ProtectedRoute><SubmitWork /></ProtectedRoute>} />
          <Route path="/queue"            element={<ProtectedRoute><JudgeQueue /></ProtectedRoute>} />
          <Route path="/judge/:id"        element={<ProtectedRoute><VerdictForm /></ProtectedRoute>} />
          <Route path="/feedback/:id"     element={<ProtectedRoute><FeedbackReveal /></ProtectedRoute>} />
          <Route path="/leaderboard"      element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/profile"          element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/submission/:id"   element={<ProtectedRoute><SubmissionDetail /></ProtectedRoute>} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
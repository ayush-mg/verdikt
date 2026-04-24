import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import Navbar from './Navbar.jsx'

const ProtectedRoute = ({ children }) => {
	const { token } = useContext(AuthContext)
	if (!token) return <Navigate to="/login" />
	return (
		<div className="min-h-screen bg-bg">
			<Navbar />
			<main className="pt-14">
				<div className="max-w-7xl mx-auto px-6 py-8">
					{children}
				</div>
			</main>
		</div>
	)
}

export default ProtectedRoute
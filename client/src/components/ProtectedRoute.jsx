import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import Navbar from './Navbar.jsx'

const ProtectedRoute = ({ children }) => {
	const { token } = useContext(AuthContext)
	
	if (!token) return <Navigate to="/login" />
	
	return (
		<div className="min-h-screen bg-brand-grey-dark flex flex-col">
			<Navbar />
			<main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
				{children}
			</main>
		</div>
	)
}

export default ProtectedRoute
import { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { LayoutDashboard, Send, Gavel, Trophy, UserCircle, LogOut } from 'lucide-react'

const Navbar = () => {
	const { token, logout } = useContext(AuthContext)
	const navigate = useNavigate()
	const location = useLocation()

	const handlelogout = () => {
		logout()
		navigate('/login')
	}

	if (!token) return null

    const navLinks = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/submit', label: 'Submit Work', icon: <Send size={20} /> },
        { path: '/queue', label: 'Judge Queue', icon: <Gavel size={20} /> },
        { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
        { path: '/profile', label: 'Profile', icon: <UserCircle size={20} /> },
    ]

	return (
		<nav className="fixed top-0 w-full glass-panel rounded-none border-b border-gray-700/50 px-6 py-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-brown-light flex items-center justify-center text-white font-bold">V</div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple-light to-gray-300">Verdikt</span>
            </div>
			<div className="flex gap-2 items-center">
                {navLinks.map((link) => (
                    <Link 
                        key={link.path} 
                        to={link.path} 
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${location.pathname === link.path ? 'bg-brand-purple/20 text-brand-purple-light shadow-inner border border-brand-purple/30' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}
                    >
                        {link.icon}
                        <span className="font-medium text-sm">{link.label}</span>
                    </Link>
                ))}
			</div>
            <button onClick={handlelogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors px-4 py-2 rounded-xl hover:bg-red-400/10">
                <LogOut size={20} />
                <span className="font-medium text-sm">Logout</span>
            </button>
		</nav>
	)
}

export default Navbar
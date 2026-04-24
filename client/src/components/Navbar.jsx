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
		{ path: '/', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
		{ path: '/submit', label: 'Submit', icon: <Send size={17} /> },
		{ path: '/queue', label: 'Judge Queue', icon: <Gavel size={17} /> },
		{ path: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={17} /> },
		{ path: '/profile', label: 'Profile', icon: <UserCircle size={17} /> },
	]

	return (
		<nav className="fixed top-0 w-full bg-surface border-b border-border z-50">
			<div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2.5 group">
					<div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">V</div>
					<span className="text-base font-bold tracking-tight text-ink">Verdikt</span>
				</Link>

				{/* Nav links */}
				<div className="flex items-center gap-1">
					{navLinks.map((link) => {
						const active = location.pathname === link.path
						return (
							<Link
								key={link.path}
								to={link.path}
								className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
									active
										? 'bg-accent text-white shadow-sm'
										: 'text-ink-2 hover:bg-raised hover:text-ink'
								}`}
							>
								{link.icon}
								<span>{link.label}</span>
							</Link>
						)
					})}
				</div>

				{/* Logout */}
				<button
					onClick={handlelogout}
					className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-3 hover:text-danger hover:bg-danger-bg transition-all duration-150"
				>
					<LogOut size={16} />
					<span>Logout</span>
				</button>
			</div>
		</nav>
	)
}

export default Navbar
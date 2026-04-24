import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosinstance from '../api/axios.js'
import { AuthContext } from '../context/AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, UserPlus, AlertCircle } from 'lucide-react'

const AuthPage = () => {
	const [islogin, setislogin] = useState(true)
	const [email, setemail] = useState('')
	const [password, setpassword] = useState('')
	const [username, setusername] = useState('')
	const [errormsg, seterrormsg] = useState('')
	const [loading, setloading] = useState(false)
	const { login } = useContext(AuthContext)
	const navigate = useNavigate()

	const handlesubmit = async (e) => {
		e.preventDefault()
		seterrormsg('')
		setloading(true)
		try {
			if (islogin) {
				const res = await axiosinstance.post('/auth/login', { email, password })
				login(res.data.user, res.data.token)
				navigate('/')
			} else {
				await axiosinstance.post('/auth/register', { username, email, password })
				setislogin(true)
				seterrormsg('Account created! Please log in.')
			}
		} catch (err) {
			seterrormsg(err.response?.data?.message || err.message || 'Network error — is the server running?')
		} finally {
			setloading(false)
		}
	}

	return (
		<div className="min-h-screen bg-bg flex items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="w-full max-w-sm"
			>
				{/* Logo */}
				<div className="text-center mb-10">
					<div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-sm">V</div>
					<h1 className="text-2xl font-bold text-ink">{islogin ? 'Welcome back' : 'Create account'}</h1>
					<p className="text-ink-3 text-sm mt-1">{islogin ? 'Sign in to Verdikt' : 'Join the Verdikt community'}</p>
				</div>

				{/* Card */}
				<div className="card p-8">
					<AnimatePresence>
						{errormsg && (
							<motion.div
								initial={{ opacity: 0, height: 0, marginBottom: 0 }}
								animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
								exit={{ opacity: 0, height: 0, marginBottom: 0 }}
								className={`flex items-start gap-2 p-3.5 rounded-xl text-sm font-medium overflow-hidden ${
									errormsg.includes('created') ? 'alert-success' : 'alert-error'
								}`}
							>
								<AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
								{errormsg}
							</motion.div>
						)}
					</AnimatePresence>

					<form onSubmit={handlesubmit} className="flex flex-col gap-4">
						<AnimatePresence>
							{!islogin && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: 'auto', opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									className="overflow-hidden"
								>
									<label className="section-label">Username</label>
									<input
										type="text"
										placeholder="Pick a username"
										value={username}
										onChange={(e) => setusername(e.target.value)}
										required
										className="input-field"
									/>
								</motion.div>
							)}
						</AnimatePresence>

						<div>
							<label className="section-label">Email</label>
							<input
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setemail(e.target.value)}
								required
								className="input-field"
							/>
						</div>

						<div>
							<label className="section-label">Password</label>
							<input
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setpassword(e.target.value)}
								required
								className="input-field"
							/>
						</div>

						<button type="submit" disabled={loading} className="btn-primary w-full mt-2">
							{loading ? (
								<span className="spinner w-4 h-4" />
							) : islogin ? (
								<><LogIn size={16} /> Sign In</>
							) : (
								<><UserPlus size={16} /> Create Account</>
							)}
						</button>
					</form>
				</div>

				<p className="text-center mt-5 text-sm text-ink-3">
					{islogin ? "Don't have an account? " : 'Already have an account? '}
					<button
						type="button"
						onClick={() => { setislogin(!islogin); seterrormsg('') }}
						className="text-ink font-semibold hover:underline"
					>
						{islogin ? 'Register' : 'Sign in'}
					</button>
				</p>
			</motion.div>
		</div>
	)
}

export default AuthPage
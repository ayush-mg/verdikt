import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosinstance from '../api/axios.js'
import { AuthContext } from '../context/AuthContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, UserPlus } from 'lucide-react'

const AuthPage = () => {
	const [islogin, setislogin] = useState(true)
	const [email, setemail] = useState('')
	const [password, setpassword] = useState('')
	const [username, setusername] = useState('')
	const [errormsg, seterrormsg] = useState('')
	const { login } = useContext(AuthContext)
	const navigate = useNavigate()

	const handlesubmit = async (e) => {
		e.preventDefault()
		seterrormsg('')
		try {
			if (islogin) {
				const res = await axiosinstance.post('/auth/login', { email, password })
				login(res.data.user, res.data.token)
				navigate('/')
			} else {
				await axiosinstance.post('/auth/register', { username, email, password })
				setislogin(true)
				seterrormsg('Registration successful. Please log in.')
			}
		} catch (err) {
			const backenderro = err.response?.data?.message
			seterrormsg(backenderro || err.message || 'Network Error. Check server connection.')
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-brand-grey-dark relative overflow-hidden px-4">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-brown rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

			<motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className="glass-panel p-8 md:p-10 w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-brand-purple to-brand-brown-light rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-purple/20">
                        <span className="text-3xl font-black text-white">V</span>
                    </div>
				    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {islogin ? 'Welcome Back' : 'Create Identity'}
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        {islogin ? 'Enter your credentials to continue' : 'Join Verdikt and start submitting'}
                    </p>
                </div>

				<AnimatePresence>
					{errormsg && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} 
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }} 
                            className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium overflow-hidden"
                        >
                            {errormsg}
                        </motion.div>
                    )}
				</AnimatePresence>

				<form onSubmit={handlesubmit} className="flex flex-col gap-5">
					<AnimatePresence>
                        {!islogin && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <input type="text" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)} required className="input-field" />
                            </motion.div>
                        )}
                    </AnimatePresence>
					<input type="email" placeholder="Email" value={email} onChange={(e) => setemail(e.target.value)} required className="input-field" />
					<input type="password" placeholder="Password" value={password} onChange={(e) => setpassword(e.target.value)} required className="input-field" />
					
                    <button type="submit" className="btn-primary mt-4">
                        {islogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                        {islogin ? 'Enter System' : 'Register Account'}
                    </button>
				</form>

				<p className="text-center mt-8 text-gray-400 text-sm">
					{islogin ? "Don't have an account yet? " : "Already a member? "}
					<span onClick={() => { setislogin(!islogin); seterrormsg(''); }} className="text-brand-purple-light hover:text-brand-purple cursor-pointer font-semibold transition-colors">
                        {islogin ? 'Register here' : 'Log in here'}
                    </span>
				</p>
			</motion.div>
		</div>
	)
}

export default AuthPage
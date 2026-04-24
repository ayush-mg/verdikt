import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { motion } from 'framer-motion'
import { Trophy, Medal } from 'lucide-react'

const Leaderboard = () => {
	const [users, setusers] = useState([])
    const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchleaderboard = async () => {
			try {
				const res = await axiosinstance.get('/users/leaderboard')
				setusers(res.data)
			} catch (error) {
				console.log(error)
			} finally {
                setLoading(false)
            }
		}
		fetchleaderboard()
	}, [])

	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-yellow-500/20 rounded-xl border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                    <Trophy size={32} className="text-yellow-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-600">Global Leaderboard</h1>
                    <p className="text-gray-400 mt-1">Top contributors ranked by their accumulated merit scores.</p>
                </div>
            </div>

            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div></div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No users found.</div>
                ) : (
                    <div className="flex flex-col">
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-brand-grey-dark/80 border-b border-gray-700/50 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                            <div className="col-span-6 md:col-span-7">User</div>
                            <div className="col-span-4 text-right">Merit Score</div>
                        </div>
                        {users.map((user, index) => (
                            <motion.div 
                                key={user._id || index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-700/20 hover:bg-brand-grey-dark/30 transition-colors ${index < 3 ? 'bg-brand-purple/5' : ''}`}
                            >
                                <div className="col-span-2 md:col-span-1 flex justify-center">
                                    {index === 0 ? <Medal size={24} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" /> : 
                                     index === 1 ? <Medal size={24} className="text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" /> : 
                                     index === 2 ? <Medal size={24} className="text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.4)]" /> : 
                                     <span className="font-bold text-gray-500 text-lg">{index + 1}</span>}
                                </div>
                                <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-gradient-to-tr from-yellow-400 to-orange-500' : 'bg-brand-grey-light'}`}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`font-semibold ${index === 0 ? 'text-yellow-400 text-lg' : 'text-gray-200'}`}>{user.username}</span>
                                </div>
                                <div className="col-span-4 text-right flex items-center justify-end gap-2">
                                    <span className="font-mono text-lg font-bold text-brand-purple-light">
                                        {(user.submissionmeritscore || 0).toFixed(1)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
		</motion.div>
	)
}

export default Leaderboard
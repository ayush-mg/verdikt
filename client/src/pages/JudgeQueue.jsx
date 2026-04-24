import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, Clock, FileText } from 'lucide-react'

const JudgeQueue = () => {
	const [queue, setqueue] = useState([])
    const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchqueue = async () => {
			try {
				const res = await axiosinstance.get('/submissions/queue')
				setqueue(res.data)
			} catch (error) {
				console.log(error)
			} finally {
                setLoading(false)
            }
		}
		fetchqueue()
	}, [])

	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-brand-purple/20 rounded-xl">
                    <Gavel size={32} className="text-brand-purple-light" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Judge Queue</h1>
                    <p className="text-gray-400 mt-1">Review peers' submissions and earn judgment merit score.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div></div>
            ) : queue.length === 0 ? (
                <div className="glass-panel p-16 text-center flex flex-col items-center">
                    <Clock size={48} className="text-gray-600 mb-4" />
                    <h2 className="text-xl font-bold text-gray-300">Queue is Empty</h2>
                    <p className="text-gray-500 mt-2">There are no submissions waiting for your judgment right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {queue.map((sub, i) => (
                        <motion.div key={sub._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 rounded-full bg-brand-grey-dark border border-gray-600 text-xs font-semibold uppercase tracking-wider text-gray-300">
                                    {sub.category}
                                </span>
                                <span className="text-gray-500 text-sm font-mono">
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="flex-1 mb-6">
                                <h3 className="text-xl font-bold mb-3 capitalize flex items-center gap-2">
                                    <FileText size={18} className="text-brand-purple-light" />
                                    {sub.type}
                                </h3>
                                <div className="bg-brand-grey-dark/50 p-4 rounded-xl border border-gray-700/50 shadow-inner">
                                    <p className="text-gray-300 text-sm line-clamp-4 leading-relaxed font-mono">
                                        {sub.contenttext || sub.contenturl || 'Image Attachment'}
                                    </p>
                                </div>
                            </div>

                            <Link to={`/judge/${sub._id}`} className="btn-primary w-full mt-auto py-4">
                                <Gavel size={18} /> Enter Judgment
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
		</motion.div>
	)
}

export default JudgeQueue
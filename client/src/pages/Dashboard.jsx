import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, Send, PlusCircle } from 'lucide-react'

const Dashboard = () => {
	const [mysubmissions, setmysubmissions] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchsubmissions = async () => {
			try {
				const res = await axiosinstance.get('/submissions/my')
				setmysubmissions(res.data)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		fetchsubmissions()
	}, [])

	const stats = [
		{ label: 'Total Submissions', value: mysubmissions.length, icon: <Send className="text-brand-purple-light" /> },
		{ label: 'Pending / Review', value: mysubmissions.filter(s => s.status !== 'completed').length, icon: <Clock className="text-brand-brown-light" /> },
		{ label: 'Completed', value: mysubmissions.filter(s => s.status === 'completed').length, icon: <CheckCircle className="text-green-400" /> },
	]

	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
			<div className="flex justify-between items-end border-b border-gray-700/50 pb-6">
				<div>
					<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Dashboard</h1>
					<p className="text-gray-400 mt-2">Welcome back. Here is an overview of your activity.</p>
				</div>
				<Link to="/submit" className="btn-primary">
					<PlusCircle size={20} />
					<span>Submit Work</span>
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{stats.map((stat, i) => (
					<motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="glass-panel p-6 flex items-center gap-4">
						<div className="p-4 bg-brand-grey-dark rounded-xl border border-gray-700/50 shadow-inner">
							{stat.icon}
						</div>
						<div>
							<p className="text-gray-400 text-sm font-medium">{stat.label}</p>
							<p className="text-3xl font-bold">{stat.value}</p>
						</div>
					</motion.div>
				))}
			</div>

			<div className="pt-6">
				<h2 className="text-2xl font-bold mb-6">Recent Submissions</h2>
				{loading ? (
					<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div></div>
				) : mysubmissions.length === 0 ? (
					<div className="glass-panel p-12 text-center flex flex-col items-center">
						<Send size={48} className="text-gray-600 mb-4" />
						<p className="text-xl text-gray-400">No submissions yet.</p>
						<p className="text-gray-500 mt-2">Submit your first piece of work to get started.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{mysubmissions.map((sub, i) => (
							<motion.div key={sub._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-6 flex flex-col h-full">
								<div className="flex justify-between items-start mb-4">
									<span className="px-3 py-1 rounded-full bg-brand-grey-dark border border-gray-600 text-xs font-semibold uppercase tracking-wider text-gray-300">
										{sub.category}
									</span>
									<span className={`px-3 py-1 rounded-full text-xs font-bold ${
										sub.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
										sub.status === 'under_review' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
										'bg-gray-500/20 text-gray-400 border border-gray-500/30'
									}`}>
										{sub.status.replace('_', ' ')}
									</span>
								</div>
								<h3 className="text-lg font-bold mb-2 capitalize">{sub.type} Submission</h3>
								<p className="text-gray-400 text-sm flex-1 line-clamp-3 mb-6">
									{sub.contenttext || sub.contenturl || 'Image Submission'}
								</p>
								{sub.status === 'completed' && (
									<Link to={`/feedback/${sub._id}`} className="btn-secondary w-full">View Feedback</Link>
								)}
							</motion.div>
						))}
					</div>
				)}
			</div>
		</motion.div>
	)
}

export default Dashboard
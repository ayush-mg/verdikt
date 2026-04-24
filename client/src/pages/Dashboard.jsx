import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, Clock, CheckCircle, PlusCircle, Star, ChevronRight } from 'lucide-react'

const statusLabel = (s) => {
	if (s === 'completed') return { label: 'Completed', cls: 'status-completed' }
	if (s === 'under_review') return { label: 'Under Review', cls: 'status-under-review' }
	return { label: 'Pending', cls: 'status-pending' }
}

const scoreColor = (score) => {
	if (score === null || score === undefined) return 'text-ink-3'
	if (score >= 4) return 'text-score'
	if (score >= 3) return 'text-warn'
	return 'text-danger'
}

const Dashboard = () => {
	const [mysubmissions, setmysubmissions] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchsubmissions = async () => {
			try {
				const res = await axiosinstance.get('/submissions/my')
				setmysubmissions(res.data)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchsubmissions()
	}, [])

	const total = mysubmissions.length
	const inreview = mysubmissions.filter(s => s.status !== 'completed').length
	const completed = mysubmissions.filter(s => s.status === 'completed').length

	const stats = [
		{ label: 'Total Submissions', value: total, icon: <Send size={18} className="text-ink-3" /> },
		{ label: 'Under Review', value: inreview, icon: <Clock size={18} className="text-warn" /> },
		{ label: 'Completed', value: completed, icon: <CheckCircle size={18} className="text-score" /> },
	]

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-2xl font-bold text-ink">Dashboard</h1>
					<p className="text-ink-3 text-sm mt-0.5">Your submission activity at a glance.</p>
				</div>
				<Link to="/submit" className="btn-primary">
					<PlusCircle size={16} /> New Submission
				</Link>
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-3 gap-4 mb-8">
				{stats.map((s, i) => (
					<motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
						<div className="flex items-center justify-between mb-3">
							<span className="text-xs font-semibold text-ink-3 uppercase tracking-wide">{s.label}</span>
							{s.icon}
						</div>
						<p className="text-3xl font-bold text-ink">{s.value}</p>
					</motion.div>
				))}
			</div>

			{/* Submissions list */}
			<div>
				<h2 className="text-lg font-bold text-ink mb-4">Your Submissions</h2>

				{loading ? (
					<div className="card p-12 flex justify-center">
						<div className="spinner w-6 h-6" />
					</div>
				) : mysubmissions.length === 0 ? (
					<div className="card p-16 text-center">
						<Send size={36} className="text-ink-4 mx-auto mb-4" />
						<p className="font-semibold text-ink-2">No submissions yet</p>
						<p className="text-ink-3 text-sm mt-1">Submit your first piece of work to get peer feedback.</p>
						<Link to="/submit" className="btn-primary mt-6 inline-flex">
							<PlusCircle size={16} /> Submit Work
						</Link>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{mysubmissions.map((sub, i) => {
							const { label, cls } = statusLabel(sub.status)
							const hasScore = sub.aggregatedscore !== null && sub.aggregatedscore !== undefined
							return (
								<motion.div
									key={sub._id}
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 }}
								>
									<Link to={`/submission/${sub._id}`} className="card-hover p-5 flex items-center gap-4 group block">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1.5">
												<span className={cls}>{label}</span>
												<span className="badge-neutral capitalize">{sub.category}</span>
												<span className="badge-neutral capitalize">{sub.type}</span>
											</div>
											<p className="text-sm text-ink-2 line-clamp-2 font-mono">
												{sub.contenttext || sub.contenturl || 'Image submission'}
											</p>
										</div>
										<div className="flex items-center gap-6 flex-shrink-0">
											{/* Judgment count */}
											<div className="text-center">
												<p className="text-xs text-ink-3 mb-0.5">Judges</p>
												<p className="font-bold text-ink">{sub.judgmentcount || 0}<span className="text-ink-3 font-normal">/5</span></p>
											</div>
											{/* Live score */}
											<div className="text-center">
												<p className="text-xs text-ink-3 mb-0.5">Score</p>
												<p className={`font-bold text-lg ${hasScore ? scoreColor(sub.aggregatedscore) : 'text-ink-4'}`}>
													{hasScore ? sub.aggregatedscore.toFixed(1) : '—'}
												</p>
											</div>
											{/* CTA */}
											{sub.status === 'completed' ? (
												<span className="btn-secondary text-xs">View Feedback <ChevronRight size={14} /></span>
											) : (
												<ChevronRight size={18} className="text-ink-4 group-hover:text-ink transition-colors" />
											)}
										</div>
									</Link>
								</motion.div>
							)
						})}
					</div>
				)}
			</div>
		</motion.div>
	)
}

export default Dashboard
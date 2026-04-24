import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, Clock, FileText, Link as LinkIcon, Image as ImageIcon, ChevronRight, Users } from 'lucide-react'

const typeIcon = (t) => {
	if (t === 'code' || t === 'text') return <FileText size={15} className="text-ink-3" />
	if (t === 'url') return <LinkIcon size={15} className="text-ink-3" />
	return <ImageIcon size={15} className="text-ink-3" />
}

const formatAge = (date) => {
	const diff = Date.now() - new Date(date)
	const h = Math.floor(diff / 3600000)
	if (h < 1) return 'just now'
	if (h < 24) return `${h}h ago`
	return `${Math.floor(h / 24)}d ago`
}

const formatRemaining = (unlocksat) => {
	if (!unlocksat) return null
	const ms = new Date(unlocksat) - Date.now()
	if (ms <= 0) return 'Expiring soon'
	const h = Math.floor(ms / 3600000)
	const m = Math.floor((ms % 3600000) / 60000)
	if (h > 0) return `${h}h ${m}m left`
	return `${m}m left`
}

const JudgeQueue = () => {
	const [queue, setqueue] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchqueue = async () => {
			try {
				const res = await axiosinstance.get('/submissions/queue')
				setqueue(res.data)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchqueue()
	}, [])

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
			{/* Header */}
			<div className="flex items-center gap-3 mb-8">
				<div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
					<Gavel size={20} className="text-white" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-ink">Judge Queue</h1>
					<p className="text-ink-3 text-sm">Review peer submissions — any submission you haven't judged yet appears here.</p>
				</div>
			</div>

			{loading ? (
				<div className="card p-12 flex justify-center"><div className="spinner w-6 h-6" /></div>
			) : queue.length === 0 ? (
				<div className="card p-16 text-center">
					<Gavel size={36} className="text-ink-4 mx-auto mb-4" />
					<p className="font-semibold text-ink-2">Queue is empty</p>
					<p className="text-sm text-ink-3 mt-1">All available submissions have been judged by you, or none exist yet.</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{queue.map((sub, i) => {
						const remaining = formatRemaining(sub.unlocksat)
						return (
							<motion.div
								key={sub._id}
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.05 }}
							>
								<div className="card-hover p-5 flex items-center gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1.5">
											{typeIcon(sub.type)}
											<span className="badge-neutral capitalize">{sub.type}</span>
											<span className="badge-neutral capitalize">{sub.category}</span>
										</div>
										<p className="text-sm text-ink-2 line-clamp-2 font-mono">
											{sub.contenttext || sub.contenturl || 'Image submission'}
										</p>
										<div className="flex items-center gap-4 mt-2">
											<span className="text-xs text-ink-4 flex items-center gap-1">
												<Clock size={12} /> {formatAge(sub.createdAt)}
											</span>
											<span className="text-xs text-ink-4 flex items-center gap-1">
												<Users size={12} /> {sub.judgmentcount || 0}/5 judged
											</span>
											{remaining && (
												<span className="text-xs text-warn flex items-center gap-1">
													<Clock size={12} /> {remaining}
												</span>
											)}
										</div>
									</div>
									<Link
										to={`/judge/${sub._id}`}
										className="btn-primary flex-shrink-0"
									>
										<Gavel size={15} /> Judge
									</Link>
								</div>
							</motion.div>
						)
					})}
				</div>
			)}
		</motion.div>
	)
}

export default JudgeQueue
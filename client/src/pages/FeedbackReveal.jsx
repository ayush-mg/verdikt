import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, Award, ArrowLeft, Star, ThumbsUp, AlertTriangle, HelpCircle, XCircle, AlertCircle } from 'lucide-react'

const VERDICT_META = {
	elegant:    { label: 'Elegant',    icon: <Star size={15} />,           cls: 'verdict-elegant'    },
	solid:      { label: 'Solid',      icon: <ThumbsUp size={15} />,       cls: 'verdict-solid'      },
	needswork:  { label: 'Needs Work', icon: <AlertTriangle size={15} />,  cls: 'verdict-needswork'  },
	confusing:  { label: 'Confusing',  icon: <HelpCircle size={15} />,     cls: 'verdict-confusing'  },
	incomplete: { label: 'Incomplete', icon: <XCircle size={15} />,        cls: 'verdict-incomplete' },
}

const FeedbackReveal = () => {
	const { id } = useParams()
	const [feedbackdata, setfeedbackdata] = useState(null)
	const [loading, setLoading] = useState(true)
	const [locked, setlocked] = useState(false)

	useEffect(() => {
		axiosinstance.get(`/submissions/${id}/feedback`)
			.then(r => setfeedbackdata(r.data))
			.catch(err => {
				if (err.response?.data?.message === 'FeedbackNotUnlocked') setlocked(true)
			})
			.finally(() => setLoading(false))
	}, [id])

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto">
			<Link to="/" className="btn-ghost mb-6 inline-flex">
				<ArrowLeft size={16} /> Back to Dashboard
			</Link>

			{loading ? (
				<div className="card p-16 flex justify-center"><div className="spinner w-6 h-6" /></div>
			) : locked ? (
				<div className="card p-14 text-center">
					<AlertCircle size={36} className="text-warn mx-auto mb-4" />
					<h2 className="text-xl font-bold text-ink">Feedback Not Yet Available</h2>
					<p className="text-ink-3 text-sm mt-2">This submission hasn't been finalized yet. Feedback unlocks after 5 judgments or 48 hours.</p>
					<Link to={`/submission/${id}`} className="btn-secondary mt-6 inline-flex">View Submission Status</Link>
				</div>
			) : !feedbackdata ? (
				<div className="alert-error">Could not load feedback. The submission may not exist.</div>
			) : (
				<>
					{/* Summary card */}
					<div className="card-accent p-6 mb-6">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div>
								<h1 className="text-2xl font-bold text-ink">Peer Feedback</h1>
								<p className="text-ink-3 text-sm mt-1 capitalize">
									{feedbackdata.submission.type} · {feedbackdata.submission.category} ·{' '}
									{feedbackdata.judgments.length} judgment{feedbackdata.judgments.length !== 1 ? 's' : ''}
								</p>
							</div>
							<div className="card p-4 text-center min-w-[120px] shadow-none">
								<p className="section-label mb-1">Final Score</p>
								<p className={`text-3xl font-bold font-mono ${
									(feedbackdata.submission.aggregatedscore || 0) >= 4 ? 'text-score' :
									(feedbackdata.submission.aggregatedscore || 0) >= 3 ? 'text-warn' : 'text-danger'
								}`}>
									{(feedbackdata.submission.aggregatedscore || 0).toFixed(2)}
								</p>
								<p className="text-xs text-ink-4 mt-0.5">/ 5.00</p>
							</div>
						</div>
					</div>

					{/* Judgment cards */}
					<div className="flex flex-col gap-4">
						<h2 className="text-sm font-bold text-ink-2 uppercase tracking-wide flex items-center gap-2">
							<MessageSquare size={15} /> Individual Judgments
						</h2>
						{feedbackdata.judgments.length === 0 ? (
							<div className="card p-8 text-center text-ink-3">No judgments recorded.</div>
						) : (
							feedbackdata.judgments.map((j, idx) => {
								const meta = VERDICT_META[j.verdict] || { label: j.verdict, cls: 'badge-neutral', icon: null }
								return (
									<motion.div
										key={idx}
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: idx * 0.08 }}
										className="card p-5"
									>
										<div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
											<span className={`badge border ${meta.cls} flex items-center gap-1.5`}>
												{meta.icon} {meta.label}
											</span>
											<span className="text-xs text-ink-4 font-mono">Reviewer #{idx + 1}</span>
										</div>
										<p className="text-sm text-ink-2 leading-relaxed">
											{j.review}
										</p>
									</motion.div>
								)
							})
						)}
					</div>
				</>
			)}
		</motion.div>
	)
}

export default FeedbackReveal
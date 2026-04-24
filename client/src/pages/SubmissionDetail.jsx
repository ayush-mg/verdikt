import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axiosinstance from '../api/axios.js'
import { motion } from 'framer-motion'
import {
	ArrowLeft, Star, ThumbsUp, AlertTriangle, HelpCircle, XCircle,
	Clock, CheckCircle, Users, Award, FileText, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react'

const VERDICT_META = {
	elegant:    { label: 'Elegant',    icon: <Star size={14} />,          cls: 'verdict-elegant',   weight: 5 },
	solid:      { label: 'Solid',      icon: <ThumbsUp size={14} />,      cls: 'verdict-solid',     weight: 4 },
	needswork:  { label: 'Needs Work', icon: <AlertTriangle size={14} />, cls: 'verdict-needswork', weight: 3 },
	confusing:  { label: 'Confusing',  icon: <HelpCircle size={14} />,   cls: 'verdict-confusing', weight: 2 },
	incomplete: { label: 'Incomplete', icon: <XCircle size={14} />,       cls: 'verdict-incomplete',weight: 1 },
}

const formatTimeRemaining = (ms) => {
	if (!ms || ms <= 0) return 'Expired'
	const h = Math.floor(ms / 3600000)
	const m = Math.floor((ms % 3600000) / 60000)
	if (h > 0) return `${h}h ${m}m remaining`
	return `${m}m remaining`
}

const SubmissionDetail = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [data, setdata] = useState(null)
	const [loading, setloading] = useState(true)
	const [error, seterror] = useState('')

	useEffect(() => {
		const fetch = async () => {
			try {
				const res = await axiosinstance.get(`/submissions/${id}/status`)
				setdata(res.data)
			} catch (err) {
				if (err.response?.status === 403) seterror('You can only view your own submission details.')
				else if (err.response?.status === 404) seterror('Submission not found.')
				else seterror('Failed to load submission.')
			} finally {
				setloading(false)
			}
		}
		fetch()
	}, [id])

	if (loading) return (
		<div className="flex justify-center items-center py-32">
			<div className="spinner w-8 h-8" />
		</div>
	)

	if (error) return (
		<div className="max-w-2xl mx-auto">
			<button onClick={() => navigate(-1)} className="btn-ghost mb-6"><ArrowLeft size={16} /> Back</button>
			<div className="alert-error">{error}</div>
		</div>
	)

	const { submission, judgments, judgmentcount, timeremaining, currentavg } = data
	const isCompleted = submission.status === 'completed'
	const progress = Math.min(judgmentcount / 5, 1)

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto">
			{/* Back button */}
			<button onClick={() => navigate('/')} className="btn-ghost mb-6">
				<ArrowLeft size={16} /> Back to Dashboard
			</button>

			{/* Status header */}
			<div className="card p-6 mb-6">
				<div className="flex items-start justify-between gap-4 mb-4">
					<div>
						<div className="flex items-center gap-2 mb-2">
							{isCompleted
								? <span className="status-completed">Completed</span>
								: <span className="status-under-review">Under Review</span>}
							<span className="badge-neutral capitalize">{submission.category}</span>
							<span className="badge-neutral capitalize">{submission.type}</span>
						</div>
						<h1 className="text-xl font-bold text-ink">Submission Detail</h1>
						<p className="text-sm text-ink-3 mt-0.5">
							Submitted {new Date(submission.createdAt).toLocaleDateString('en-US', { year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit' })}
						</p>
					</div>
					{/* Score */}
					<div className="text-center card p-4 min-w-[110px] shadow-none border border-border">
						<Award size={20} className="text-ink-3 mx-auto mb-1" />
						<p className="text-xs text-ink-3 font-semibold uppercase tracking-wide mb-0.5">Score</p>
						<p className={`text-2xl font-bold ${
							currentavg === null ? 'text-ink-4' :
							currentavg >= 4 ? 'text-score' :
							currentavg >= 3 ? 'text-warn' : 'text-danger'
						}`}>
							{currentavg !== null ? currentavg.toFixed(2) : '—'}
						</p>
						<p className="text-xs text-ink-4">/ 5.00</p>
					</div>
				</div>

				{/* Progress */}
				<div className="mb-4">
					<div className="flex items-center justify-between text-sm mb-2">
						<span className="flex items-center gap-1.5 font-medium text-ink-2">
							<Users size={15} /> {judgmentcount} of 5 judgments received
						</span>
						{!isCompleted && timeremaining > 0 && (
							<span className="flex items-center gap-1.5 text-ink-3 text-xs">
								<Clock size={13} /> {formatTimeRemaining(timeremaining)}
							</span>
						)}
						{isCompleted && (
							<span className="flex items-center gap-1.5 text-score text-xs font-semibold">
								<CheckCircle size={13} /> Finalized
							</span>
						)}
					</div>
					<div className="progress-track">
						<div className="progress-fill" style={{ width: `${progress * 100}%` }} />
					</div>
					<p className="text-xs text-ink-4 mt-1.5">
						{isCompleted
							? 'All judgments collected. View the full feedback below.'
							: `Completes at 5 judgments or when the 48-hour window expires.`}
					</p>
				</div>

				{/* Link to feedback when complete */}
				{isCompleted && (
					<Link to={`/feedback/${submission._id}`} className="btn-primary w-full">
						<Award size={16} /> View Full Peer Feedback
					</Link>
				)}
			</div>

			{/* Content preview */}
			<div className="card p-6 mb-6">
				<h2 className="text-sm font-bold text-ink-2 uppercase tracking-wide mb-4 flex items-center gap-2">
					{submission.type === 'code' && <FileText size={15} />}
					{submission.type === 'text' && <FileText size={15} />}
					{submission.type === 'url' && <LinkIcon size={15} />}
					{submission.type === 'image' && <ImageIcon size={15} />}
					Submitted Content
				</h2>
				{submission.type === 'image' && submission.contenturl ? (
					<img src={submission.contenturl} alt="Submission" className="w-full rounded-xl max-h-80 object-contain bg-raised" />
				) : submission.type === 'url' ? (
					<a href={submission.contenturl} target="_blank" rel="noopener noreferrer" className="text-info hover:underline break-all">{submission.contenturl}</a>
				) : (
					<pre className="bg-raised border border-border p-4 rounded-xl text-ink-2 text-sm whitespace-pre-wrap break-words max-h-80 overflow-auto font-mono leading-relaxed">
						{submission.contenttext || '(empty)'}
					</pre>
				)}
			</div>

			{/* Judgment list — show anonymized verdicts */}
			{judgments.length > 0 && (
				<div className="card p-6">
					<h2 className="text-sm font-bold text-ink-2 uppercase tracking-wide mb-4">
						Judgments Received ({judgments.length})
					</h2>
					<div className="flex flex-col gap-4">
						{judgments.map((j, idx) => {
							const meta = VERDICT_META[j.verdict] || { label: j.verdict, cls: 'badge-neutral', icon: null }
							return (
								<motion.div
									key={idx}
									initial={{ opacity: 0, y: 4 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.06 }}
									className="border border-border rounded-xl p-4"
								>
									<div className="flex items-center justify-between mb-3">
										<span className={`badge border ${meta.cls} flex items-center gap-1`}>
											{meta.icon} {meta.label}
										</span>
										<span className="text-xs text-ink-4 font-mono">Judge #{idx + 1}</span>
									</div>
									<p className="text-sm text-ink-2 leading-relaxed bg-raised rounded-lg p-3 font-mono">
										{j.review}
									</p>
								</motion.div>
							)
						})}
					</div>
				</div>
			)}

			{judgments.length === 0 && !loading && (
				<div className="card p-10 text-center">
					<Users size={32} className="text-ink-4 mx-auto mb-3" />
					<p className="font-semibold text-ink-2">No judgments yet</p>
					<p className="text-sm text-ink-3 mt-1">Sit tight — your peers will review this soon.</p>
				</div>
			)}
		</motion.div>
	)
}

export default SubmissionDetail

import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
	Gavel, Star, ThumbsUp, AlertTriangle, HelpCircle, XCircle,
	ArrowLeft, FileText, Link as LinkIcon, Image as ImageIcon, AlertCircle
} from 'lucide-react'

const RATINGS = [
	{ id: 'elegant',    label: 'Elegant',    icon: <Star size={20} />,           hint: 'Outstanding — very impressed' },
	{ id: 'solid',      label: 'Solid',      icon: <ThumbsUp size={20} />,       hint: 'Good, well-executed work' },
	{ id: 'needswork',  label: 'Needs Work', icon: <AlertTriangle size={20} />,  hint: 'Some issues to address' },
	{ id: 'confusing',  label: 'Confusing',  icon: <HelpCircle size={20} />,     hint: 'Hard to understand' },
	{ id: 'incomplete', label: 'Incomplete', icon: <XCircle size={20} />,        hint: 'Appears unfinished' },
]

const RATING_COLORS = {
	elegant:    { active: 'bg-amber-50 border-amber-300 text-amber-800',   idle: 'border-border' },
	solid:      { active: 'bg-green-50 border-green-300 text-green-800',   idle: 'border-border' },
	needswork:  { active: 'bg-orange-50 border-orange-300 text-orange-800',idle: 'border-border' },
	confusing:  { active: 'bg-red-50 border-red-300 text-red-800',         idle: 'border-border' },
	incomplete: { active: 'bg-gray-100 border-gray-400 text-gray-700',     idle: 'border-border' },
}

const VerdictForm = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [verdict, setverdict] = useState('solid')
	const [review, setreview] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [submission, setsubmission] = useState(null)
	const [loadingsub, setloadingsub] = useState(true)
	const [errormsg, seterrormsg] = useState('')

	useEffect(() => {
		axiosinstance.get(`/submissions/${id}`)
			.then(r => setsubmission(r.data))
			.catch(() => seterrormsg('Could not load submission details.'))
			.finally(() => setloadingsub(false))
	}, [id])

	const handlesubmit = async (e) => {
		e.preventDefault()
		if (!review.trim()) { seterrormsg('Please write a feedback review.'); return }
		setSubmitting(true)
		seterrormsg('')
		try {
			await axiosinstance.post('/judgments', { submissionid: id, verdict, review })
			navigate('/queue')
		} catch (err) {
			const msg = err.response?.data?.message
			if (msg === 'AlreadyJudged') seterrormsg('You have already judged this submission.')
			else if (msg === 'CannotJudgeOwnWork') seterrormsg('You cannot judge your own submission.')
			else seterrormsg(msg || 'Submission failed. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-2xl mx-auto">
			<button onClick={() => navigate('/queue')} className="btn-ghost mb-6">
				<ArrowLeft size={16} /> Back to Queue
			</button>

			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
					<Gavel size={20} className="text-white" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-ink">Submit Verdict</h1>
					<p className="text-ink-3 text-sm">Review the submission and give honest, constructive feedback.</p>
				</div>
			</div>

			{/* Submission preview */}
			{loadingsub ? (
				<div className="card p-8 flex justify-center mb-6"><div className="spinner w-5 h-5" /></div>
			) : submission && (
				<div className="card-accent p-5 mb-6">
					<div className="flex items-center gap-2 mb-3">
						{(submission.type === 'code' || submission.type === 'text') && <FileText size={15} className="text-ink-3" />}
						{submission.type === 'url' && <LinkIcon size={15} className="text-ink-3" />}
						{submission.type === 'image' && <ImageIcon size={15} className="text-ink-3" />}
						<span className="text-sm font-semibold text-ink-2 capitalize">{submission.type} · {submission.category}</span>
					</div>
					{submission.type === 'image' && submission.contenturl ? (
						<img src={submission.contenturl} alt="Submission" className="w-full rounded-lg max-h-72 object-contain bg-raised" />
					) : submission.type === 'url' ? (
						<a href={submission.contenturl} target="_blank" rel="noopener noreferrer" className="text-info hover:underline break-all text-sm">{submission.contenturl}</a>
					) : (
						<pre className="bg-raised border border-border p-4 rounded-lg text-sm text-ink-2 font-mono whitespace-pre-wrap break-words max-h-64 overflow-auto leading-relaxed">
							{submission.contenttext || '(no content)'}
						</pre>
					)}
				</div>
			)}

			{errormsg && (
				<div className="alert-error mb-5">
					<AlertCircle size={15} className="flex-shrink-0" /> {errormsg}
				</div>
			)}

			<form onSubmit={handlesubmit} className="card p-7 flex flex-col gap-7">
				{/* Rating */}
				<div>
					<p className="section-label">Your Rating</p>
					<div className="grid grid-cols-5 gap-2">
						{RATINGS.map(opt => {
							const active = verdict === opt.id
							const c = RATING_COLORS[opt.id]
							return (
								<button
									key={opt.id}
									type="button"
									onClick={() => setverdict(opt.id)}
									title={opt.hint}
									className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-semibold transition-all duration-150 ${
										active ? c.active : `bg-surface ${c.idle} text-ink-3 hover:bg-raised hover:text-ink-2`
									}`}
								>
									{opt.icon}
									<span className="text-xs text-center leading-tight">{opt.label}</span>
								</button>
							)
						})}
					</div>
					{verdict && (
						<p className="text-xs text-ink-3 mt-2 text-center italic">
							{RATINGS.find(r => r.id === verdict)?.hint}
						</p>
					)}
				</div>

				{/* Review */}
				<div>
					<p className="section-label">Written Feedback</p>
					<textarea
						value={review}
						onChange={(e) => setreview(e.target.value)}
						maxLength={800}
						required
						placeholder="Be specific and constructive. What works well? What could be improved?"
						className="input-field min-h-[140px] resize-y"
					/>
					<div className="flex justify-between items-center mt-1.5">
						<p className="text-xs text-ink-4">Be respectful and constructive</p>
						<p className={`text-xs font-mono ${review.length > 720 ? 'text-danger' : 'text-ink-4'}`}>
							{review.length}/800
						</p>
					</div>
				</div>

				{/* Actions */}
				<div className="pt-3 border-t border-border flex justify-end gap-3">
					<button type="button" onClick={() => navigate('/queue')} className="btn-secondary">Cancel</button>
					<button type="submit" disabled={submitting} className="btn-primary">
						{submitting ? <><span className="spinner w-4 h-4" /> Submitting...</> : <><Gavel size={15} /> Confirm Verdict</>}
					</button>
				</div>
			</form>
		</motion.div>
	)
}

export default VerdictForm
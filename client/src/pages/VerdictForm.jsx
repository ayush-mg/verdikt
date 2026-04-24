import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gavel, Star, ThumbsUp, AlertTriangle, HelpCircle, XCircle, FileText, Link as LinkIcon, Image as ImageIcon, ArrowLeft } from 'lucide-react'

const VerdictForm = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [verdict, setverdict] = useState('solid')
	const [review, setreview] = useState('')
    const [submitting, setSubmitting] = useState(false)
	const [submission, setsubmission] = useState(null)
	const [loadingsubmission, setloadingsubmission] = useState(true)
	const [errormsg, seterrormsg] = useState('')

	useEffect(() => {
		const fetchsubmission = async () => {
			try {
				// Fetch submission directly by ID
				const res = await axiosinstance.get(`/submissions/${id}`)
				setsubmission(res.data)
			} catch (error) {
				console.error(error)
				seterrormsg('Could not load submission details.')
			} finally {
				setloadingsubmission(false)
			}
		}
		fetchsubmission()
	}, [id])

	const handlesubmit = async (e) => {
		e.preventDefault()
		if(!review.trim()){
			seterrormsg('Please write a review before submitting.')
			return
		}
        setSubmitting(true)
		seterrormsg('')
		try {
			await axiosinstance.post('/judgments', { submissionid: id, verdict, review })
			navigate('/queue')
		} catch (error) {
			const msg = error.response?.data?.message
			if(msg === 'AlreadyJudged') seterrormsg('You have already judged this submission.')
			else if(msg === 'CannotJudgeOwnWork') seterrormsg('You cannot judge your own submission.')
			else seterrormsg(msg || 'An error occurred. Please try again.')
			console.error(error)
        } finally {
            setSubmitting(false)
        }
	}

    const ratingOptions = [
        { id: 'elegant', label: 'Elegant', icon: <Star size={24} />, color: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/10' },
        { id: 'solid', label: 'Solid', icon: <ThumbsUp size={24} />, color: 'text-green-400', border: 'border-green-400/50', bg: 'bg-green-400/10' },
        { id: 'needswork', label: 'Needs Work', icon: <AlertTriangle size={24} />, color: 'text-orange-400', border: 'border-orange-400/50', bg: 'bg-orange-400/10' },
        { id: 'confusing', label: 'Confusing', icon: <HelpCircle size={24} />, color: 'text-red-400', border: 'border-red-400/50', bg: 'bg-red-400/10' },
        { id: 'incomplete', label: 'Incomplete', icon: <XCircle size={24} />, color: 'text-gray-400', border: 'border-gray-400/50', bg: 'bg-gray-400/10' }
    ]

	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl mx-auto">
            <button onClick={() => navigate('/queue')} className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-purple-light transition-colors font-medium mb-6">
                <ArrowLeft size={18} /> Back to Queue
            </button>

            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-brand-brown-light/20 rounded-xl">
                    <Gavel size={32} className="text-brand-brown-light" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Submit Verdict</h1>
                    <p className="text-gray-400 mt-1">Review the submission below and give constructive feedback.</p>
                </div>
            </div>

            {/* Submission Preview */}
            {loadingsubmission ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div></div>
            ) : submission ? (
                <div className="glass-panel p-6 mb-8 border-l-4 border-l-brand-purple">
                    <div className="flex items-center gap-3 mb-4">
                        {submission.type === 'code' && <FileText size={20} className="text-brand-purple-light" />}
                        {submission.type === 'text' && <FileText size={20} className="text-blue-400" />}
                        {submission.type === 'url' && <LinkIcon size={20} className="text-green-400" />}
                        {submission.type === 'image' && <ImageIcon size={20} className="text-pink-400" />}
                        <span className="font-bold text-lg capitalize">{submission.type} Submission</span>
                        <span className="ml-auto px-3 py-1 rounded-full bg-brand-grey-dark border border-gray-600 text-xs font-semibold uppercase tracking-wider text-gray-300">{submission.category}</span>
                    </div>
                    {submission.type === 'image' && submission.contenturl ? (
                        <img src={submission.contenturl} alt="Submission" className="w-full rounded-xl max-h-80 object-contain bg-black/20" />
                    ) : submission.type === 'url' ? (
                        <a href={submission.contenturl} target="_blank" rel="noopener noreferrer" className="text-brand-purple-light hover:underline break-all">{submission.contenturl}</a>
                    ) : (
                        <pre className="bg-brand-grey-dark/80 p-4 rounded-xl border border-gray-700/50 text-gray-300 text-sm whitespace-pre-wrap break-words max-h-72 overflow-auto font-mono leading-relaxed">{submission.contenttext || '(No content)'}</pre>
                    )}
                </div>
            ) : null}

            {/* Error Message */}
            {errormsg && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium mb-6">
                    {errormsg}
                </div>
            )}

			<form onSubmit={handlesubmit} className="glass-panel p-8 space-y-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Your Rating</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {ratingOptions.map(opt => (
                            <div 
                                key={opt.id}
                                onClick={() => setverdict(opt.id)}
                                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${verdict === opt.id ? `${opt.bg} ${opt.border} ${opt.color} shadow-inner scale-105` : 'bg-brand-grey-dark/50 border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200'}`}
                            >
                                {opt.icon}
                                <span className="font-bold text-sm text-center">{opt.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Detailed Feedback</label>
                    <textarea 
                        value={review} 
                        onChange={(e) => setreview(e.target.value)} 
                        maxLength="800" 
                        required
                        placeholder="Explain your verdict. Be constructive and specific..."
                        className="input-field min-h-[150px]"
                    />
                    <div className="text-right text-xs text-gray-500 mt-2 font-mono">
                        {review.length} / 800
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-700/50 flex justify-end gap-4">
                    <button type="button" onClick={() => navigate('/queue')} className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={submitting} className={`btn-primary ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {submitting ? 'Submitting...' : 'Confirm Judgment'}
                    </button>
                </div>
			</form>
		</motion.div>
	)
}

export default VerdictForm
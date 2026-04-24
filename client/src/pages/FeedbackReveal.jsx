import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, Award, ArrowLeft, Star, ThumbsUp, AlertTriangle, HelpCircle, XCircle } from 'lucide-react'

const FeedbackReveal = () => {
	const { id } = useParams()
	const [feedbackdata, setfeedbackdata] = useState(null)
    const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchfeedback = async () => {
			try {
				const res = await axiosinstance.get(`/submissions/${id}/feedback`)
				setfeedbackdata(res.data)
			} catch (error) {
				console.log(error)
			} finally {
                setLoading(false)
            }
		}
		fetchfeedback()
	}, [id])

    const getVerdictIcon = (verdict) => {
        switch(verdict) {
            case 'elegant': return <Star className="text-yellow-400" size={20} />
            case 'solid': return <ThumbsUp className="text-green-400" size={20} />
            case 'needswork': return <AlertTriangle className="text-orange-400" size={20} />
            case 'confusing': return <HelpCircle className="text-red-400" size={20} />
            case 'incomplete': return <XCircle className="text-gray-400" size={20} />
            default: return <MessageSquare className="text-brand-purple-light" size={20} />
        }
    }

	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-8">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-purple-light transition-colors font-medium">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div></div>
            ) : !feedbackdata ? (
                <div className="glass-panel p-16 text-center">
                    <AlertTriangle size={48} className="text-orange-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold">Feedback Not Available</h2>
                    <p className="text-gray-400 mt-2">This submission might not be unlocked yet, or it doesn't exist.</p>
                </div>
            ) : (
                <>
                    <div className="glass-panel p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-l-4 border-l-brand-purple">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Feedback Revealed</h1>
                            <p className="text-gray-400 mt-1 capitalize">For your {feedbackdata.submission.type} submission in {feedbackdata.submission.category}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-brand-grey-dark rounded-xl border border-gray-700/50 shadow-inner min-w-[150px]">
                            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Aggregated Score</span>
                            <div className="flex items-center gap-2">
                                <Award className="text-brand-purple-light" size={24} />
                                <span className="text-3xl font-black text-white">{(feedbackdata.submission.aggregatedscore || 0).toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                            <MessageSquare className="text-brand-brown-light" size={24} />
                            Peer Judgments
                        </h2>
                        
                        {feedbackdata.judgments.length === 0 ? (
                            <p className="text-gray-500 pl-2">No peer reviews were recorded.</p>
                        ) : (
                            feedbackdata.judgments.map((j, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card p-6"
                                >
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700/50">
                                        {getVerdictIcon(j.verdict)}
                                        <span className="font-bold text-lg capitalize">{j.verdict.replace('needswork', 'Needs Work')}</span>
                                        <span className="ml-auto text-xs text-gray-500 font-mono">Judge #{index + 1}</span>
                                    </div>
                                    <div className="bg-brand-grey-dark/30 p-4 rounded-lg font-mono text-sm leading-relaxed text-gray-300">
                                        {j.review}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </>
            )}
		</motion.div>
	)
}

export default FeedbackReveal
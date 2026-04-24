import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star } from 'lucide-react'

const rankMedal = (i) => {
	if (i === 0) return <Trophy size={18} className="text-amber-500" />
	if (i === 1) return <Medal size={18} className="text-gray-400" />
	if (i === 2) return <Medal size={18} className="text-amber-700" />
	return <span className="text-sm font-bold text-ink-3 w-5 text-center">{i + 1}</span>
}

const scoreBadge = (score) => {
	if (score >= 4.5) return 'text-score font-bold'
	if (score >= 3.5) return 'text-warn font-bold'
	return 'text-danger font-bold'
}

const Leaderboard = () => {
	const [users, setusers] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchleaderboard = async () => {
			try {
				const res = await axiosinstance.get('/users/leaderboard')
				setusers(res.data)
			} catch (error) {
				console.error(error)
			} finally {
				setLoading(false)
			}
		}
		fetchleaderboard()
	}, [])

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto">
			{/* Header */}
			<div className="flex items-center gap-3 mb-8">
				<div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center">
					<Trophy size={20} className="text-amber-600" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-ink">Leaderboard</h1>
					<p className="text-ink-3 text-sm">Ranked by submission merit score — updates after every judgment.</p>
				</div>
			</div>

			<div className="card overflow-hidden">
				{/* Table header */}
				<div className="grid grid-cols-12 gap-4 px-6 py-3 bg-raised border-b border-border">
					<div className="col-span-1 text-center section-label mb-0">#</div>
					<div className="col-span-7 section-label mb-0">User</div>
					<div className="col-span-2 text-right section-label mb-0">Submissions</div>
					<div className="col-span-2 text-right section-label mb-0">Score</div>
				</div>

				{loading ? (
					<div className="flex justify-center py-12"><div className="spinner w-6 h-6" /></div>
				) : users.length === 0 ? (
					<div className="p-12 text-center">
						<Star size={32} className="text-ink-4 mx-auto mb-3" />
						<p className="font-semibold text-ink-2">No ranked users yet</p>
						<p className="text-sm text-ink-3 mt-1">Submit work and get judged to appear on the leaderboard.</p>
					</div>
				) : (
					users.map((user, index) => (
						<motion.div
							key={user._id}
							initial={{ opacity: 0, x: -6 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.04 }}
							className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border last:border-0 ${
								index === 0 ? 'bg-amber-50/60' : 'hover:bg-raised'
							} transition-colors`}
						>
							{/* Rank */}
							<div className="col-span-1 flex justify-center">
								{rankMedal(index)}
							</div>

							{/* User */}
							<div className="col-span-7 flex items-center gap-3">
								<div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
									index === 0 ? 'bg-amber-400 text-white' : 'bg-raised border border-border text-ink-2'
								}`}>
									{user.username.charAt(0).toUpperCase()}
								</div>
								<div>
									<p className={`font-semibold ${index === 0 ? 'text-amber-700' : 'text-ink'}`}>
										{user.username}
									</p>
								</div>
							</div>

							{/* Submissions */}
							<div className="col-span-2 text-right">
								<span className="text-sm text-ink-3">{user.totalsubmissions || 0}</span>
							</div>

							{/* Score */}
							<div className="col-span-2 text-right">
								<span className={`text-lg font-mono ${scoreBadge(user.submissionmeritscore || 0)}`}>
									{(user.submissionmeritscore || 0).toFixed(2)}
								</span>
							</div>
						</motion.div>
					))
				)}
			</div>

			<p className="text-center text-xs text-ink-4 mt-4">
				Score is averaged from all submissions (scale: 1–5). Only users with submissions appear here.
			</p>
		</motion.div>
	)
}

export default Leaderboard
import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { motion } from 'framer-motion'
import { User, Award, FileText, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Profile = () => {
	const [userprofile, setuserprofile] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		axiosinstance.get('/users/profile')
			.then(r => setuserprofile(r.data))
			.catch(e => console.error(e))
			.finally(() => setLoading(false))
	}, [])

	if (loading) return (
		<div className="flex justify-center items-center py-32">
			<div className="spinner w-8 h-8" />
		</div>
	)

	if (!userprofile) return (
		<div className="alert-error max-w-md mx-auto mt-20">Failed to load profile.</div>
	)

	const historyData = userprofile.submissionmerithistory?.map((h, i) => ({
		name: `#${i + 1}`,
		score: parseFloat(parseFloat(h.score).toFixed(2))
	})) || []

	const stats = [
		{
			label: 'Merit Score',
			value: (userprofile.submissionmeritscore || 0).toFixed(2),
			sub: 'Submission average',
			icon: <Award size={20} className="text-ink-3" />,
			valueClass: 'text-score'
		},
		{
			label: 'Submissions',
			value: userprofile.totalsubmissions || 0,
			sub: 'Total submitted',
			icon: <FileText size={20} className="text-ink-3" />,
			valueClass: 'text-ink'
		},
		{
			label: 'Judged',
			value: userprofile.totaljudged || 0,
			sub: 'Judgments given',
			icon: <CheckCircle size={20} className="text-ink-3" />,
			valueClass: 'text-ink'
		},
	]

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-3xl mx-auto space-y-6">
			{/* Identity card */}
			<div className="card p-7 flex items-center gap-5">
				<div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white text-2xl font-bold shadow-sm">
					{userprofile.username.charAt(0).toUpperCase()}
				</div>
				<div>
					<h1 className="text-xl font-bold text-ink">{userprofile.username}</h1>
					<p className="text-ink-3 text-sm mt-0.5">{userprofile.email}</p>
					<p className="text-xs text-ink-4 mt-1">
						Member since {new Date(userprofile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
					</p>
				</div>
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-3 gap-4">
				{stats.map((s, i) => (
					<motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
						<div className="flex items-center justify-between mb-3">
							<span className="section-label mb-0">{s.label}</span>
							{s.icon}
						</div>
						<p className={`text-3xl font-bold ${s.valueClass}`}>{s.value}</p>
						<p className="text-xs text-ink-4 mt-1">{s.sub}</p>
					</motion.div>
				))}
			</div>

			{/* Merit progression chart */}
			<div className="card p-6">
				<h2 className="text-sm font-bold text-ink-2 uppercase tracking-wide mb-5 flex items-center gap-2">
					<Award size={16} /> Merit Score Progression
				</h2>
				{historyData.length > 0 ? (
					<ResponsiveContainer width="100%" height={220}>
						<LineChart data={historyData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e0deda" />
							<XAxis dataKey="name" stroke="#b8b5b0" tick={{ fontSize: 12 }} />
							<YAxis stroke="#b8b5b0" tick={{ fontSize: 12 }} domain={[0, 5]} />
							<Tooltip
								contentStyle={{
									backgroundColor: '#fff',
									borderColor: '#e0deda',
									borderRadius: 10,
									fontSize: 13,
									color: '#111'
								}}
							/>
							<Line
								type="monotone"
								dataKey="score"
								stroke="#2d5a27"
								strokeWidth={2.5}
								dot={{ r: 4, fill: '#2d5a27', strokeWidth: 0 }}
								activeDot={{ r: 6 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				) : (
					<div className="h-48 flex flex-col items-center justify-center text-ink-4">
						<Award size={28} className="mb-2 opacity-40" />
						<p className="text-sm">No history yet. Get your submissions judged!</p>
					</div>
				)}
			</div>
		</motion.div>
	)
}

export default Profile
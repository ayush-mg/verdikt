import { useState, useEffect } from 'react'
import axiosinstance from '../api/axios.js'
import { motion } from 'framer-motion'
import { User, Award, FileText, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Profile = () => {
	const [userprofile, setuserprofile] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchprofile = async () => {
			try {
				const res = await axiosinstance.get('/users/profile')
				setuserprofile(res.data)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		fetchprofile()
	}, [])

	if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div></div>
	if (!userprofile) return <p className="text-center text-gray-400 mt-20">Failed to load profile.</p>

    const historyData = userprofile.submissionmerithistory?.map((h, i) => ({
        name: `Sub ${i + 1}`,
        score: parseFloat(h.score).toFixed(2)
    })) || []

	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
			<div className="flex items-center gap-6 glass-panel p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-purple to-brand-brown-light flex items-center justify-center shadow-lg shadow-brand-purple/20">
                    <User size={48} className="text-white opacity-80" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{userprofile.username}</h1>
                    <p className="text-gray-400 flex items-center gap-2 mt-1">{userprofile.email}</p>
                </div>
			</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
                    <Award size={32} className="text-brand-purple-light mb-2" />
                    <p className="text-gray-400 text-sm">Merit Score</p>
                    <p className="text-3xl font-bold mt-1">{(userprofile.submissionmeritscore || 0).toFixed(1)}</p>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
                    <FileText size={32} className="text-brand-brown-light mb-2" />
                    <p className="text-gray-400 text-sm">Total Submissions</p>
                    <p className="text-3xl font-bold mt-1">{userprofile.totalsubmissions || 0}</p>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
                    <CheckCircle size={32} className="text-green-400 mb-2" />
                    <p className="text-gray-400 text-sm">Total Judged</p>
                    <p className="text-3xl font-bold mt-1">{userprofile.totaljudged || 0}</p>
                </div>
            </div>

            <div className="glass-panel p-6 h-96">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Award size={20} className="text-brand-purple-light" />
                    Merit Progression
                </h2>
                {historyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={historyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem' }} />
                            <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-4/5 flex items-center justify-center text-gray-500">
                        No merit history available yet.
                    </div>
                )}
            </div>
		</motion.div>
	)
}

export default Profile
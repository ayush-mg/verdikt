import { useState } from 'react'
import axiosinstance from '../api/axios.js'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Image as ImageIcon, Link as LinkIcon, Code, Type, Upload, ChevronDown } from 'lucide-react'

const SubmitWork = () => {
	const [type, settype] = useState('code')
	const [category, setcategory] = useState('frontend')
	const [contenttext, setcontenttext] = useState('')
	const [file, setfile] = useState(null)
	const [contenturl, setcontenturl] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [error, seterror] = useState('')
	const navigate = useNavigate()

	const handlesubmit = async (e) => {
		e.preventDefault()
		setSubmitting(true)
		seterror('')
		try {
			const formdata = new FormData()
			formdata.append('type', type)
			formdata.append('category', category)
			if (type === 'image' && file) {
				formdata.append('image', file)
			} else if (type === 'code' || type === 'text') {
				formdata.append('contenttext', contenttext)
			} else if (type === 'url') {
				formdata.append('contenturl', contenturl)
			}
			await axiosinstance.post('/submissions', formdata)
			navigate('/')
		} catch (err) {
			seterror(err.response?.data?.message || 'Submission failed. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	const typeOptions = [
		{ id: 'code', label: 'Code', icon: <Code size={16} /> },
		{ id: 'text', label: 'Text / Essay', icon: <Type size={16} /> },
		{ id: 'image', label: 'Image', icon: <ImageIcon size={16} /> },
		{ id: 'url', label: 'Live URL', icon: <LinkIcon size={16} /> },
	]

	const categoryOptions = ['frontend', 'backend', 'design', 'writing', 'logic']

	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-2xl mx-auto">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-ink">Submit Work</h1>
				<p className="text-ink-3 text-sm mt-1">Share your work with the community for anonymous peer review.</p>
			</div>

			{error && <div className="alert-error mb-6">{error}</div>}

			<form onSubmit={handlesubmit} className="card p-8 flex flex-col gap-7">
				{/* Type */}
				<div>
					<p className="section-label">Submission Type</p>
					<div className="grid grid-cols-4 gap-2">
						{typeOptions.map(opt => (
							<button
								key={opt.id}
								type="button"
								onClick={() => settype(opt.id)}
								className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all duration-150 ${
									type === opt.id
										? 'bg-accent text-white border-accent shadow-sm'
										: 'bg-surface border-border text-ink-2 hover:border-border-strong hover:bg-raised'
								}`}
							>
								{opt.icon}
								{opt.label}
							</button>
						))}
					</div>
				</div>

				{/* Category */}
				<div>
					<p className="section-label">Category</p>
					<div className="relative">
						<ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
						<select
							value={category}
							onChange={(e) => setcategory(e.target.value)}
							className="input-field pr-10 appearance-none capitalize cursor-pointer"
						>
							{categoryOptions.map(cat => (
								<option key={cat} value={cat} className="capitalize">{cat}</option>
							))}
						</select>
					</div>
				</div>

				{/* Content */}
				<AnimatePresence mode="wait">
					<motion.div
						key={type}
						initial={{ opacity: 0, y: 4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.15 }}
					>
						<p className="section-label">
							{type === 'image' ? 'Upload Image' : type === 'url' ? 'Project URL' : 'Content'}
						</p>
						{type === 'image' ? (
							<div className="relative border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center text-center hover:border-accent-3 hover:bg-raised transition-all duration-150 cursor-pointer">
								<input
									type="file"
									accept="image/*"
									onChange={(e) => setfile(e.target.files[0])}
									required
									className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								/>
								<Upload size={28} className="text-ink-4 mb-3" />
								<p className="font-medium text-ink-2 text-sm">{file ? file.name : 'Click or drag image here'}</p>
								<p className="text-xs text-ink-4 mt-1">PNG, JPG, GIF up to 5MB</p>
							</div>
						) : type === 'url' ? (
							<input
								type="url"
								placeholder="https://example.com"
								value={contenturl}
								onChange={(e) => setcontenturl(e.target.value)}
								required
								className="input-field"
							/>
						) : (
							<textarea
								placeholder={type === 'code' ? 'Paste your code here...' : 'Write your text or essay here...'}
								value={contenttext}
								onChange={(e) => setcontenttext(e.target.value)}
								required
								className="input-field min-h-[200px] font-mono text-sm resize-y"
							/>
						)}
					</motion.div>
				</AnimatePresence>

				{/* Submit */}
				<div className="pt-2 border-t border-border flex justify-end gap-3">
					<button type="button" onClick={() => navigate('/')} className="btn-secondary">Cancel</button>
					<button type="submit" disabled={submitting} className="btn-primary">
						{submitting ? <span className="spinner w-4 h-4" /> : <Send size={15} />}
						{submitting ? 'Submitting...' : 'Submit for Review'}
					</button>
				</div>
			</form>
		</motion.div>
	)
}

export default SubmitWork
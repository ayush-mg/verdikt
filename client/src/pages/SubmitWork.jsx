import { useState } from 'react'
import axiosinstance from '../api/axios.js'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Image as ImageIcon, Link as LinkIcon, Code, Type, Layout, Upload } from 'lucide-react'

const SubmitWork = () => {
	const [type, settype] = useState('code')
	const [category, setcategory] = useState('frontend')
	const [contenttext, setcontenttext] = useState('')
	const [file, setfile] = useState(null)
	const [contenturl, setcontenturl] = useState('')
    const [submitting, setSubmitting] = useState(false)
	const navigate = useNavigate()

	const handlesubmit = async (e) => {
		e.preventDefault()
        setSubmitting(true)
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
		} catch (error) {
			console.log(error)
		} finally {
            setSubmitting(false)
        }
	}

    const typeOptions = [
        { id: 'code', label: 'Code Snippet', icon: <Code size={18} /> },
        { id: 'text', label: 'Text / Essay', icon: <Type size={18} /> },
        { id: 'image', label: 'Design Image', icon: <ImageIcon size={18} /> },
        { id: 'url', label: 'Live URL', icon: <LinkIcon size={18} /> }
    ]

    const categoryOptions = ['frontend', 'backend', 'design', 'writing', 'logic']

	return (
		<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Submit New Work</h1>
                <p className="text-gray-400 mt-2">Share your creation with the community for peer review and merit points.</p>
            </div>

            <form onSubmit={handlesubmit} className="glass-panel p-8 space-y-8">
                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Submission Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {typeOptions.map(opt => (
                            <div 
                                key={opt.id}
                                onClick={() => settype(opt.id)}
                                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${type === opt.id ? 'bg-brand-purple/20 border-brand-purple text-brand-purple-light shadow-inner' : 'bg-brand-grey-dark/50 border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200'}`}
                            >
                                {opt.icon}
                                <span className="font-medium text-sm">{opt.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Category</label>
                    <div className="relative">
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <select 
                            value={category} 
                            onChange={(e) => setcategory(e.target.value)}
                            className="input-field pl-12 appearance-none capitalize"
                        >
                            {categoryOptions.map(cat => (
                                <option key={cat} value={cat} className="capitalize bg-brand-grey-dark">{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dynamic Input based on Type */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={type}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                            {type === 'image' ? 'Upload Image' : type === 'url' ? 'Project URL' : 'Content'}
                        </label>
                        
                        {type === 'image' ? (
                            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-brand-grey-dark/30 hover:bg-brand-grey-dark/50 transition-colors cursor-pointer relative">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setfile(e.target.files[0])} 
                                    required 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload size={32} className="text-brand-purple-light mb-4" />
                                <p className="font-medium text-gray-300">{file ? file.name : 'Click or drag image to upload'}</p>
                                <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
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
                                placeholder="Paste your code or text here..."
                                value={contenttext} 
                                onChange={(e) => setcontenttext(e.target.value)} 
                                required 
                                className="input-field min-h-[200px] font-mono text-sm"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="pt-4 border-t border-gray-700/50">
                    <button type="submit" disabled={submitting} className={`btn-primary w-full ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {submitting ? (
                            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Processing...</>
                        ) : (
                            <><Send size={20} /> Submit for Review</>
                        )}
                    </button>
                </div>
            </form>
		</motion.div>
	)
}

export default SubmitWork
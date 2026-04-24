import{BrowserRouter as Router,Routes,Route}from'react-router-dom'
import{AuthProvider}from'./context/AuthContext.jsx'
import ProtectedRoute from'./components/ProtectedRoute.jsx'
import Login from'./pages/Login.jsx'
import Register from'./pages/Register.jsx'
import Dashboard from'./pages/Dashboard.jsx'
import SubmitWork from'./pages/SubmitWork.jsx'
import JudgeQueue from'./pages/JudgeQueue.jsx'
import VerdictForm from'./pages/VerdictForm.jsx'
import FeedbackReveal from'./pages/FeedbackReveal.jsx'
const App=()=>{
	return(
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Register/>}/>
					<Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
					<Route path="/submit" element={<ProtectedRoute><SubmitWork/></ProtectedRoute>}/>
					<Route path="/queue" element={<ProtectedRoute><JudgeQueue/></ProtectedRoute>}/>
					<Route path="/judge/:id" element={<ProtectedRoute><VerdictForm/></ProtectedRoute>}/>
					<Route path="/feedback/:id" element={<ProtectedRoute><FeedbackReveal/></ProtectedRoute>}/>
				</Routes>
			</Router>
		</AuthProvider>
	)
}
export default App
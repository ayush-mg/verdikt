import{createContext,useState}from'react'
export const AuthContext=createContext()
export const AuthProvider=({children})=>{
	const[user,setuser]=useState(null)
	const[token,settoken]=useState(localStorage.getItem('token')||'')
	const login=(userdata,jwttoken)=>{
		localStorage.setItem('token',jwttoken)
		settoken(jwttoken)
		setuser(userdata)
	}
	const logout=()=>{
		localStorage.removeItem('token')
		settoken('')
		setuser(null)
	}
	return(
		<AuthContext.Provider value={{user,token,login,logout}}>
			{children}
		</AuthContext.Provider>
	)
}
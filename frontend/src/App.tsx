import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import { userAuth } from './context/AuthContext'
import Footer from './components/footer/Footer'

function App() {
  console.log(userAuth()?.isLoggedIn);
  const [count, setCount] = useState(0)
  const auth = userAuth();

  return (
    <main>
      <Header />
      <Routes>
        <Route  path="/" element={<Home />}/>
        <Route  path="/login" element={<Login />}/>
        <Route  path="/signup" element={<SignUp />}/>
        <Route  path="/chat" element={<Chat />}/>
        { auth?.isLoggedIn && auth.user && ( <Route  path="*" element={<NotFound />}/> )}
      </Routes>
    </main>
  )
}

export default App

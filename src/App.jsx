import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { AppRoutes } from './routes/AppRoutes'
import { BrowserRouter } from 'react-router-dom'
import { Signup } from './screens/Signup'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Layout } from './routes/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Layout/>
      </BrowserRouter> 

    </>
  )
}

export default App

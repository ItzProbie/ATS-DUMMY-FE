import { useState } from 'react'
import {BrowserRouter , Routes,Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Upload from './pages/Uploader'
function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path= '/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/upload' element={<Upload/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}


export default App
import { BrowserRouter } from 'react-router'
import LoginPage from './pages/login'
import { Routes } from 'react-router'
import { Route } from 'react-router'

function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/investor/login' element={<LoginPage />} />
        <Route path='/trader/login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

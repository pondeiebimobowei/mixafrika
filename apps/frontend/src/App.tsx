import { BrowserRouter } from 'react-router'
import LoginPage from './pages/login'
import { Routes } from 'react-router'
import { Route } from 'react-router'
import TraderLoginPage from './pages/trader-login'
import InvestorLoginPage from './pages/investor-login'
import TraderDashboard from './pages/trader/dashboard'
import AgentLoginPage from './pages/agent-login'
import AgentDashboard from './pages/agent/dashboard'

function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/investor/login' element={<InvestorLoginPage />} />
        <Route path='/trader/login' element={<TraderLoginPage />} />
        <Route path='/agent/login' element={<AgentLoginPage />} />

        
        <Route path='/dashboard' element={<TraderDashboard />} />
        <Route path='/agent/dashboard' element={<AgentDashboard />} />
        <Route path='/agent/trader' element={<AgentDashboard />} />
        <Route path='/agent/trader/:id' element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

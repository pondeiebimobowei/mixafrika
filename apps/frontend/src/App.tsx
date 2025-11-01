import { BrowserRouter } from 'react-router'
import LoginPage from './pages/login'
import { Routes } from 'react-router'
import { Route } from 'react-router'
import TraderLoginPage from './pages/auth/login/trader'
import InvestorLoginPage from './pages/auth/login/investor'
import TraderDashboard from './pages/trader/dashboard'
import AgentLoginPage from './pages/auth/login/agent'
import AgentDashboard from './pages/agent/dashboard'
import AgentRepaymentsPage from './pages/agent/repayments'
import AgentProfilePage from './pages/agent/profile'
import AgentReportsPage from './pages/agent/reports'
import AgentTraderProfilePage from './pages/agent/trader-details'
import AgentManagedTradersPage from './pages/agent/traders'
import AgentWalletPage from './pages/agent/wallet'

function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/investor/login' element={<InvestorLoginPage />} />
        <Route path='/trader/login' element={<TraderLoginPage />} />
        <Route path='/agent/login' element={<AgentLoginPage />} />

        <Route path='/trader' element={<TraderDashboard />} />
        <Route path='/trader/dashboard' element={<TraderDashboard />} />
        <Route path='/dashboard' element={<TraderDashboard />} />
        
        <Route path='/agent/dashboard' element={<AgentDashboard />} />
        <Route path='/agent/profile' element={<AgentProfilePage />} />
        <Route path='/agent/repayments' element={<AgentRepaymentsPage />} />
        <Route path='/agent/reports' element={<AgentReportsPage />} />
        <Route path='/agent/trader/:id' element={<AgentTraderProfilePage />} />
        <Route path='/agent/traders' element={<AgentManagedTradersPage />} />
        <Route path='/agent/wallet' element={<AgentWalletPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

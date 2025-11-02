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
import ClusterDetailPage from './pages/cluster/cluster-detail'
import TraderProfilePage from './pages/trader/profile'
import FundApplicationPage from './pages/trader/apply'
import EsusuPage from './pages/trader/esusu'
import SocialFeedPage from './pages/social/social'
import RepaymentsPage from './pages/trader/repayment'

function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/investor/login' element={<InvestorLoginPage />} />
        <Route path='/trader/login' element={<TraderLoginPage />} />
        <Route path='/agent/login' element={<AgentLoginPage />} />
        
        <Route path='/market' element={<AgentLoginPage />} />

        <Route path='/cluster/:id' element={<ClusterDetailPage />} />

        <Route path='/profile' element={<ClusterDetailPage />} />

        <Route path='/dashboard' element={<TraderDashboard />} />
        
        <Route path='/trader'>
          <Route  element={<TraderDashboard />} />
          <Route path='/dashboard' element={<TraderDashboard />} />
          <Route path='/profile' element={<TraderProfilePage />} />
          <Route path='/apply' element={<FundApplicationPage />} />
          <Route path='/apply' element={<EsusuPage />} />
          <Route path='/repayment' element={<RepaymentsPage />} />

        </Route>


        <Route path='/social' element={<SocialFeedPage />} />

        
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

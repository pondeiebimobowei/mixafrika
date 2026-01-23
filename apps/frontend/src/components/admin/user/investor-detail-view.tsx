import { CheckCircle, Mail, Shield } from "lucide-react";
import InfoCard from "../card/info-card";
import StatsCard from "../card/stat-card";
import type { IUser } from "../../../../../../packages/shared/src/types/user";
import { StatusBadge } from "@/pages/admin/user";

export default function InvestorDetailView(user: IUser){

    return(
        <div className="space-y-6">
      {/* Financial Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Total Portfolio" value={`₦${562000}`} trend_change="+12.5% this month" />
        <StatsCard label="Total Invested" value={`₦${562000}`} trend_change="+12.5% this month" />
        <StatsCard label="ROI Earned" value="12.5%" trend_change="₦45,000 pending payout" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity & Risk */}
        <div className="space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Core Identity</h3>
            </div>

             <div className="space-y-3">
               {/* <InfoCard icon={Phone} label="Phone" value={user.phone || 'N/A'} subValue="Verified via OTP" /> */}
               <InfoCard icon={Mail} label="Email" value={user.email} subValue="Verified" />
               <InfoCard icon={Shield} label="KYC Status" value={<StatusBadge status={user.verification?.status || 'pending'} />} subValue={user?.verification?.id_number ? "BVN Verified" : "BVN Pending"} />
               {/* <InfoCard icon={Smartphone} label="Devices" value={`${user.loginDevices || 1} Active Devices`} subValue="Last Login: iPhone 14 Pro" /> */}
             </div>
           </div>

           <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Risk Profile</h3>
            </div>

             {/* <div className="flex items-center justify-between mb-4">
               <span className="text-sm text-gray-500">Fraud Score</span>
               <span className={`px-2 py-1 rounded text-xs font-bold ${user.fraudScore && user.fraudScore > 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                 {user.fraudScore || 0}/100
               </span>
             </div>
             <div className="w-full bg-gray-100 h-2 rounded-full mb-4">
               <div className={`h-2 rounded-full ${user.fraudScore && user.fraudScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${user.fraudScore || 5}%` }}></div>
             </div> */}
             <div className="space-y-2 text-sm text-gray-600">
               <div className="flex justify-between"><span>Identity Match</span><CheckCircle size={14} className="text-green-500" /></div>
               <div className="flex justify-between"><span>Sanctions List</span><CheckCircle size={14} className="text-green-500" /></div>
             </div>
           </div>
        </div>

        {/* Middle/Right: Financials & Activity */}
        <div className="lg:col-span-2 space-y-6">
           {/* Wallet Structure */}
           {/* <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Wallet Breakdown</h3>
            </div>
             <div className="grid grid-cols-3 gap-4 text-center">
               <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                 <p className="text-xs text-green-800 font-semibold uppercase">Main Wallet</p>
                 <p className="text-lg font-bold text-gray-900 mt-1">₦{user.walletStructure?.main.toLocaleString() || '0'}</p>
               </div>
               <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <p className="text-xs text-blue-800 font-semibold uppercase">Flex Savings</p>
                 <p className="text-lg font-bold text-gray-900 mt-1">₦{user.walletStructure?.savings.toLocaleString() || '0'}</p>
               </div>
               <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                 <p className="text-xs text-amber-800 font-semibold uppercase">Locked Funds</p>
                 <p className="text-lg font-bold text-gray-900 mt-1">₦{user.walletStructure?.locked.toLocaleString() || '0'}</p>
               </div>
             </div>
           </div> */}

           {/* Investment Activity */}
           <div className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden">
             <div className="p-6 border-b border-gray-50">
               <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Active Investments</h3>
                </div>
             </div>
             {/* <div className="divide-y divide-gray-50">
               {MOCK_CLUSTERS.slice(0, user.totalClusters || 2).map(cluster => (
                 <div key={cluster.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                       <div className="bg-primary/10 p-2 rounded-lg text-primary"><Briefcase size={20} /></div>
                       <div>
                          <p className="text-sm font-bold text-gray-900">{cluster.title}</p>
                          <p className="text-xs text-gray-500">Ends: {new Date(cluster.endDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-green-600">{cluster.roi}% ROI</p>
                       <p className="text-xs text-gray-500">₦{(user.totalInvested || 0) / (user.totalClusters || 1)} invested</p>
                    </div>
                 </div>
               ))}
             </div> */}
           </div>
        </div>
      </div>
    </div>
    )
}
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, LayoutGrid, MapPin } from "lucide-react";
import InfoCard from "../card/info-card";
import StatsCard from "../card/stat-card";
import type { IUserBusiness } from "../../../../../../packages/shared/src/types/user-business";
import type { ITransaction } from "../../../../../../packages/shared/src/types/transaction";
import type { IWallet } from "../../../../../../packages/shared/src/types/wallet";

export default function TraderDetailView(){

    const businesss: Partial<IUserBusiness> = {}
    const transactions: ITransaction[] = []
    const wallet: Partial<IWallet> = {}

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
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Business Profile</h3>
            </div>
            <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500 uppercase">Business Name</p>
                <p className="text-sm font-bold text-gray-900">{businesss.name}</p>
                </div>
                <InfoCard icon={MapPin} label="Market Location" value={businesss.city + ', ' + businesss.state} />
                <InfoCard icon={LayoutGrid} label="Category" value={businesss.type} />
                {/* <InfoCard icon={UserCheck} label="Assigned Agent" value={user.assignedAgentId || 'None'} subValue="Verification Mode: Card" /> */}
            </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Credit Health</h3>
          </div>
          <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Repayment Rate</span>
              <span className="font-bold text-gray-900">{20}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mb-4">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${20}%` }}></div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-700">Delinquency Status</p>
                <p className="text-xs text-red-600">{'None'}</p>
              </div>
          </div>
        </div>

        {/* Middle/Right: Financials & Activity */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50">
               <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Savings Performance</h3>
              </div>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 border border-gray-100 rounded-xl">
                     <p className="text-xs text-gray-500 uppercase">Daily Contribution</p>
                     <p className="text-xl font-bold text-gray-900">₦2,500</p>
                     <p className="text-xs text-green-600 mt-1">98% consistency</p>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-xl">
                     <p className="text-xs text-gray-500 uppercase">Target Savings</p>
                     <p className="text-xl font-bold text-gray-900">₦{wallet.available_balance}</p>
                     <p className="text-xs text-gray-400 mt-1">Goal: ₦500,000</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-50">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Transaction Logs</h3>
              </div>
               <div className="space-y-2">
                  {transactions.map(tx => (
                     <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {tx.amount > 0 ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-900">{tx.type}</p>
                              <p className="text-xs text-gray-500">{new Date(String(tx.createdAt)).toLocaleDateString()} • {'Unknown Device'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-bold text-gray-900">₦{Math.abs(tx.amount).toLocaleString()}</p>
                           {true && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">High Risk</span>}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
        </div>
      </div>
    </div>
    )
}
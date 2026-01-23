
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown, AlertCircle, MapPin, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';


const PriorityItems = () => {
    const navigate  = useNavigate()

    return (
        <Card className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
           <CardHeader className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Priority Action Items</h3>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 flex items-center gap-1 hover:bg-gray-50">
                    Filter <ChevronDown size={14} />
                 </button>
              </div>
           </CardHeader>

           <CardContent className="overflow-x-auto">
             <table className="w-full">
               <thead className="bg-gray-50/50">
                 <tr>
                   <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider rounded-l-lg">Item</th>
                   <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source</th>
                   <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Severity</th>
                   <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider rounded-r-lg">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 <tr className="group hover:bg-gray-50/50 transition-colors">
                     <td className="px-4 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                            <AlertCircle size={16} />
                         </div>
                         <div>
                           <p className="text-sm font-bold text-gray-900">Large Withdrawal</p>
                           <p className="text-xs text-gray-400">Agent u6 Cluster</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-4 py-4 text-xs font-medium text-gray-600">Operations</td>
                     <td className="px-4 py-4"><span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">CRITICAL</span></td>
                     <td className="px-4 py-4">
                       <button onClick={() => navigate('/transactions')} className="text-xs text-primary font-bold hover:underline">Review</button>
                     </td>
                 </tr>
                 <tr className="group hover:bg-gray-50/50 transition-colors">
                     <td className="px-4 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Shield size={16} />
                         </div>
                         <div>
                           <p className="text-sm font-bold text-gray-900">Identity Mismatch</p>
                           <p className="text-xs text-gray-400">New Trader Registration</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-4 py-4 text-xs font-medium text-gray-600">Compliance</td>
                     <td className="px-4 py-4"><span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">HIGH</span></td>
                     <td className="px-4 py-4">
                       <button onClick={() => navigate('/kyc')} className="text-xs text-primary font-bold hover:underline">Verify</button>
                     </td>
                 </tr>
                 <tr className="group hover:bg-gray-50/50 transition-colors">
                     <td className="px-4 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <MapPin size={16} />
                         </div>
                         <div>
                           <p className="text-sm font-bold text-gray-900">Zone Deviation</p>
                           <p className="text-xs text-gray-400">Agent u3 (Tunde)</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-4 py-4 text-xs font-medium text-gray-600">Tracking</td>
                     <td className="px-4 py-4"><span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold">MEDIUM</span></td>
                     <td className="px-4 py-4">
                       <button onClick={() => navigate('/tracking', { state: { agentId: 'u3' } })} className="text-xs text-primary font-bold hover:underline">Track</button>
                     </td>
                 </tr>
               </tbody>
             </table>
           </CardContent>
        </Card>
    );
};

export default PriorityItems;

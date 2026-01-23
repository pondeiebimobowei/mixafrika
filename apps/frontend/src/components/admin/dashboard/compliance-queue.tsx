
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, ChevronDown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router';

const ComplianceQueue = () => {

    const navigate = useNavigate()

    return (
        <Card className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
           <CardHeader className="flex p-0 justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900">Compliance Queue</h3>
              <button onClick={() => navigate('/kyc')} className="text-xs font-semibold text-primary hover:text-primary-700 flex items-center gap-1">
                 View All
              </button>
           </CardHeader>
           
           <CardContent className="space-y-4 p-0">
              <div 
                onClick={() => navigate('/kyc')}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors"
              >
                 <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Shield size={16} /></div>
                 <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">12 Pending KYC</p>
                    <p className="text-xs text-gray-500">Requires manual review</p>
                 </div>
                 <ChevronDown size={14} className="text-gray-400" />
              </div>
              <div 
                onClick={() => navigate('/transactions')}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors"
              >
                 <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={16} /></div>
                 <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">5 Flagged Tx</p>
                    <p className="text-xs text-gray-500">Suspicious volume detected</p>
                 </div>
                 <ChevronDown size={14} className="text-gray-400" />
              </div>
           </CardContent>
        </Card>
    );
};

export default ComplianceQueue;

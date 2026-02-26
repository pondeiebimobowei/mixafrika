import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

const DONUT_DATA = [
  { name: 'Liquid Cash', value: 450000, color: '#1E7F4F' },
  { name: 'Active Loans', value: 250000, color: '#86EFAC' },
  { name: 'Locked Assets', value: 156200, color: '#BBF7D0' },
];

const AssetAllocationChart = () => {

    return (
        <Card className="p-0 bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
               <h3 className="text-lg font-bold text-gray-900">Asset Allocation</h3>
               <button className="text-xs font-medium text-gray-500 flex items-center hover:text-gray-900">
                  Real-time
               </button>
            </div>
            
            <div className="relative h-48 w-full flex items-center justify-center mb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={DONUT_DATA}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                     >
                        {DONUT_DATA.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[10px] text-gray-400 font-medium">Total Assets</p>
                  <p className="text-xl font-bold text-gray-900">₦856.2M</p>
               </div>
            </div>

            <div className="space-y-3">
               {DONUT_DATA.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs font-medium text-gray-600">{item.name}</span>
                     </div>
                     <span className="text-xs font-bold text-gray-900">₦{(item.value / 1000).toFixed(0)}k</span>
                  </div>
               ))}
            </div>
         </Card>
    );
};

export default AssetAllocationChart;

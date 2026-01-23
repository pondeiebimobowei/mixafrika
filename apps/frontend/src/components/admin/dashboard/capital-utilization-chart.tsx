import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


const CHART_DATA = [
  { name: 'Jan', liquidity: 4000, credit: 2400 },
  { name: 'Feb', liquidity: 3000, credit: 1398 },
  { name: 'Mar', liquidity: 2000, credit: 9800 },
  { name: 'Apr', liquidity: 2780, credit: 3908 },
  { name: 'May', liquidity: 1890, credit: 4800 },
  { name: 'Jun', liquidity: 2390, credit: 3800 },
  { name: 'Jul', liquidity: 3490, credit: 4300 },
];


const CapitalUtilizationChart = () => {
    return (
        <Card className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
           <CardHeader className="flex justify-between items-center mb-8">
              <div>
                 <h3 className="text-lg font-bold text-gray-900">Capital Utilization</h3>
                 <p className="text-xs text-gray-500">Liquidity Inflow vs Credit Deployment</p>
              </div>
              <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#0F4A2D]"></span>
                     <span className="text-xs font-semibold text-gray-600">Liquidity</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#86EFAC]"></span>
                     <span className="text-xs font-semibold text-gray-600">Credit</span>
                  </div>
              </div>
           </CardHeader>
           
           <CardContent className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ backgroundColor: '#1F2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="liquidity" fill="#0F4A2D" radius={[6, 6, 6, 6]} barSize={12} />
                <Bar dataKey="credit" fill="#86EFAC" radius={[6, 6, 6, 6]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
           </CardContent>
        </Card>
    );
};

export default CapitalUtilizationChart;

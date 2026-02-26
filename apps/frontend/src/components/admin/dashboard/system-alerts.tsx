
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

export const MOCK_SYSTEM_ALERTS = [
  { id: 1, type: 'critical', message: 'Fraud Detection: Multiple high-value withdrawals from Agent u6 cluster', time: 'Just now', category: 'Security' },
  { id: 2, type: 'warning', message: 'KYC Backlog: 12 new approvals pending for > 24 hours', time: '1 hour ago', category: 'Compliance' },
  { id: 3, type: 'info', message: 'System Maintenance scheduled for 2:00 AM WAT', time: '3 hours ago', category: 'System' },
  { id: 4, type: 'warning', message: 'Agent Offline Spike: 15 agents in Ibadan region unavailable', time: '4 hours ago', category: 'Operations' },
  { id: 5, type: 'info', message: 'Daily Backup completed successfully', time: '6 hours ago', category: 'System' },
];

const SystemAlerts = () => {
    const navigate = useNavigate()

    return (
        <Card className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
            <CardHeader className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gray-900">System Alerts</h3>
               <Bell size={16} className="text-gray-400" />
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="relative">
                   <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                   {MOCK_SYSTEM_ALERTS.slice(0, 4).map((alert, i) => (
                      <div key={i} className="flex gap-3 relative mb-5 last:mb-0">
                         <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10 border-2 border-white shadow-sm ${
                            alert.type === 'critical' ? 'bg-red-500 text-white' : 
                            alert.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                         }`}>
                            {alert.type === 'critical' ? '!' : 'i'}
                         </div>
                         <div>
                            <p className="text-xs text-gray-900 font-medium leading-snug">{alert.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] text-gray-400">{alert.time}</span>
                               <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{alert.category}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-full text-center text-xs text-primary font-bold hover:underline pt-2"
                >
                   View All Notifications
                </button>
            </CardContent>
         </Card>
    );
};

export default SystemAlerts;

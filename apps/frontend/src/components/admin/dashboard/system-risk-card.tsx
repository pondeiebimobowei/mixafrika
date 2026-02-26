
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

const SystemRiskCard = () => {

    return (
        <Card 
            // onClick={() => navigate('/risk')}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all group"
            >
                <CardHeader className="flex p-0 justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">System Risk Exposure</h3>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                </CardHeader>
                
            <CardContent className='p-0'>
                <div className="mb-2 flex justify-between items-end">
                    <span className="text-2xl font-bold text-gray-900">18.2%</span>
                    <span className="text-xs text-green-600 font-medium mb-1 bg-green-50 px-2 py-0.5 rounded">Low Risk</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                    <div className="bg-green-500 h-2 rounded-full w-[18.2%]"></div>
                </div>
                
                <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">Target: Keep below 25% exposure</p>

            </CardContent>
        </Card>
    );
};

export default SystemRiskCard;

export default function OperaitonalPulse(){
    return(
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900">Operational Pulse</h3>
                <div className="flex items-center gap-1">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <span className="text-xs text-green-600 font-medium">Live</span>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                   <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Success Rate</p>
                   <p className="text-lg font-bold text-gray-900">99.8%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                   <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Avg Latency</p>
                   <p className="text-lg font-bold text-gray-900">45ms</p>
                </div>
             </div>
         </div>
    )
}
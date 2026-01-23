import type { ICluster } from "../../../../../../packages/shared/src/types/cluster";
import type { ICollection } from "../../../../../../packages/shared/src/types/collection";
import { TrendingUp, Users } from "lucide-react";

export default function ClusterCard({cluster, onClick}: {cluster: ICluster, onClick: () => void}){
    const collection: ICollection[] = [];
    return (
        <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-soft border border-gray-50 overflow-hidden hover:shadow-card transition-all cursor-pointer group"
    >
      <div className="p-6"> 
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {cluster.status}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{cluster.name}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
              <Users size={16} />
              <span>404 Participants</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-700 font-medium mb-1">Target Return</p>
              <div className="flex items-center gap-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-lg font-bold text-green-700">{cluster.roi}%</span>
              </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-600 font-medium mb-1">Min Entry</p>
              <span className="text-lg font-bold text-gray-900">₦{collection[0].min_investment}</span>
          </div>
        </div>

        {/* <div className="space-y-2">
          <div className="flex justify-between text-sm">
              <span className="text-gray-500">Fundraising</span>
              <span className="font-semibold text-gray-900">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
              ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
              <span>₦{cluster.totalRaised.toLocaleString()} raised</span>
              <span>Target: ₦{cluster.target.toLocaleString()}</span>
          </div>
        </div> */}
      </div>
    </div>
    )
}
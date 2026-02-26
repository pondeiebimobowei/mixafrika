import type { LucideIcon } from "lucide-react";

interface Props {
    icon: LucideIcon;
    label: string;
    value: string | React.ReactNode;
    subValue?: string;
}

export default function InfoCard({icon: Icon, label, value, subValue}: Props){
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">{label}</p>
        <div className="text-sm font-semibold text-gray-900">{value}</div>
        {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
      </div>
    </div>
    )
}
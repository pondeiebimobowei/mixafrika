interface Props {
    label: string;
    value: string;
    trend_change: string;
    color?: string;
}

export default function StatsCard({ label, value, trend_change, color = 'bg-white' }: Props){
    return (
            <div className={`${color} p-4 rounded-xl border border-gray-100 shadow-sm`}>
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className={`text-xs font-medium mt-1 text-green-600`}>{trend_change}</p>
            </div>
    )
}
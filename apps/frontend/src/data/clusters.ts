
import type { Cluster, ClusterStatus } from '@/types';
import { TrendingUp, Banknote, CheckCircle } from 'lucide-react';

export const clusterData: { [key: string]: Cluster } = {
  'balogun-textiles': {
    id: 'balogun-textiles',
    name: 'Balogun Textiles',
    category: 'Textiles & Apparel',
    description: 'A vibrant hub for textile traders in the heart of Lagos, offering a wide range of fabrics from traditional prints to modern designs. This cluster is known for its high turnover and consistent demand.',
    totalVolume: 15000000,
    performance: 25,
    cycle: '90 days',
    repayment: '95%',
    status: 'active' as ClusterStatus,
    roi: '+25%',
    trend: 'up',
    logo: null, // Placeholder
    color: '', // Placeholder
    bgColor: '', // Placeholder
    traders: [
      {
        name: 'Aunty Funke',
        experience: '15+ years',
        rating: 4.8,
        avatar: 'https://picsum.photos/seed/401/150/150'
      },
      {
        name: 'Idris Bello',
        experience: '8 years',
        rating: 4.6,
        avatar: 'https://picsum.photos/seed/402/150/150'
      }
    ],
    cycleProgress: {
        daysElapsed: 17,
        daysTotal: 90
    },
    sentiments: [
      { user: 'Tunde O.', rating: 5, comment: 'Great returns, always pays on time!', avatar: 'https://picsum.photos/seed/501/150/150' },
      { user: 'Aisha B.', rating: 4, comment: 'Solid investment, a bit slow on communication sometimes.', avatar: 'https://picsum.photos/seed/502/150/150' },
      { user: 'Emeka K.', rating: 5, comment: 'My go-to cluster for steady income.', avatar: 'https://picsum.photos/seed/503/150/150' },
    ],
    activities: [
        { type: 'roi', message: 'Daily ROI of +0.83% credited', time: '3h ago', icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { type: 'investment', message: 'New investment of ₦250,000 received', time: '1d ago', icon: Banknote, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
        { type: 'payout', message: 'Cycle completed. Payouts processed.', time: '31d ago', icon: CheckCircle, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    ]
  },
  'onitsha-electronics': {
    id: 'onitsha-electronics',
    name: 'Onitsha Electronics',
    category: 'Consumer Electronics',
    description: 'The largest electronics market in West Africa, dealing in everything from household appliances to the latest gadgets. High-growth potential with a tech-savvy trader base.',
    totalVolume: 25000000,
    performance: 30,
    cycle: '45 days',
    repayment: '14%',
    status: 'pooling' as ClusterStatus,
    poolCurrent: 18500000,
    poolTarget: 25000000,
    roi: '+30%',
    trend: 'down',
    logo: null, // Placeholder
    color: '', // Placeholder
    bgColor: '', // Placeholder
    traders: [
      {
        name: 'Mr. Ebuka',
        experience: '10 years',
        rating: 4.9,
        avatar: 'https://picsum.photos/seed/403/150/150'
      },
       {
        name: 'Chinaza Okoro',
        experience: '12 years',
        rating: 4.8,
        avatar: 'https://picsum.photos/seed/404/150/150'
      },
      {
        name: 'Ikenna Soludo',
        experience: '7 years',
        rating: 4.7,
        avatar: 'https://picsum.photos/seed/405/150/150'
      }
    ],
    sentiments: [
        { user: 'Ngozi A.', rating: 5, comment: 'Amazing returns, very professional traders.', avatar: 'https://picsum.photos/seed/504/150/150' },
        { user: 'Bello S.', rating: 5, comment: 'I have invested in multiple cycles, always profitable.', avatar: 'https://picsum.photos/seed/505/150/150' },
    ],
    activities: [
        { type: 'investment', message: 'New investment of ₦500,000 received', time: '2d ago', icon: Banknote, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    ]
  },
  'aba-shoes': {
    id: 'aba-shoes',
    name: 'Aba Shoes',
    category: 'Artisanal Manufacturing',
    description: 'Famed for its skilled artisans and quality leatherwork, the Aba shoe cluster is a cornerstone of local manufacturing, exporting footwear across the country.',
    totalVolume: 8000000,
    performance: 28,
    cycle: '30 days',
    repayment: '96%',
    status: 'active' as ClusterStatus,
    roi: '+28%',
    trend: 'up',
    logo: null, // Placeholder
    color: '', // Placeholder
    bgColor: '', // Placeholder
    traders: [
        {
            name: 'Papa Ugo',
            experience: '25+ years',
            rating: 4.7,
            avatar: 'https://picsum.photos/seed/406/150/150'
        }
    ],
    cycleProgress: {
        daysElapsed: 25,
        daysTotal: 30
    },
    sentiments: [
        { user: 'Funke A.', rating: 4, comment: 'Good cluster, consistent profit.', avatar: 'https://picsum.photos/seed/506/150/150' },
    ],
    activities: [
        { type: 'roi', message: 'Daily ROI of +0.93% credited', time: '1h ago', icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-500/10' },
        { type: 'investment', message: 'New investment of ₦150,000 received', time: '3d ago', icon: Banknote, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    ]
  },
  'kano-grains': {
    id: 'kano-grains',
    name: 'Kano Grains',
    category: 'Agriculture',
    description: 'A major trading hub for agricultural commodities like rice, maize, and millet. This cluster benefits from seasonal demand and government agricultural programs.',
    totalVolume: 12000000,
    performance: 32,
    cycle: '60 days',
    repayment: '98%',
    status: 'pooling' as ClusterStatus,
    poolCurrent: 8000000,
    poolTarget: 12000000,
    roi: '+32%',
    trend: 'up',
    logo: null, // Placeholder
    color: '', // Placeholder
    bgColor: '', // Placeholder
    traders: [
      {
        name: 'Alhaji Musa',
        experience: '20 years',
        rating: 4.9,
        avatar: 'https://picsum.photos/seed/407/150/150'
      },
      {
        name: 'Hajiya Fatima',
        experience: '10 years',
        rating: 4.8,
        avatar: 'https://picsum.photos/seed/408/150/150'
      }
    ],
    sentiments: [
        { user: 'Suleiman D.', rating: 5, comment: 'Very reliable returns, especially during harvest season.', avatar: 'https://picsum.photos/seed/507/150/150' },
        { user: 'Chidinma O.', rating: 4, comment: 'Good diversification for my portfolio away from tech.', avatar: 'https://picsum.photos/seed/508/150/150' },
    ],
    activities: [
        { type: 'investment', message: 'New investment of ₦300,000 received', time: '1d ago', icon: Banknote, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    ]
  }
};

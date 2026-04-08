import { useState, useEffect } from "react";
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';


const useStates = () => {

    const [stats, setStats] = useState( [
  { label: 'Locataires', value: '18', icon: UsersIcon, color: 'bg-green-500', trend: '+8%', trendUp: true },
  { label: 'Contrats actifs', value: '0', icon: DocumentTextIcon, color: 'bg-purple-500', trend: '-3%', trendUp: false },
  { label: 'Revenus mensuels', value: '0 $', icon: CurrencyDollarIcon, color: 'bg-yellow-500', trend: '+18%', trendUp: true },
  { label: 'Biens', value: 0, icon: HomeIcon, color: 'bg-blue-500', trend: '+12%', trendUp: true }
])

    const actualiseState = (target, data) => {

        setStats((prev) => {

            const exists = prev.find(s => s.label === target);

            if (exists) {

                return prev.map(s =>
                    s.label === target
                        ? { ...s, value: data.length }
                        : s
                )
            }

            return (
                [
                    ...prev,
                    {
                        label: target,
                        value: data.length,
                        icon: HomeIcon,
                        color: 'bg-blue-500',
                        trend: '+12%',
                        trendUp: true
                    }
                ])
        }

        )


    }

    return {
        stats,
        actualiseState
    }
}
export default useStates;
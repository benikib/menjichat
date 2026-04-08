import useAuthStore from "../store/useAuthStore";
import { useEffect ,useState} from "react";
import { useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  PlusIcon,
  ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline';


import useStates from "../hooks/useStats";

function Home() {
  const { user, role } = useAuthStore();
  const {biens,fetchBiens}=useBien();
  const {contrats,fetchContrats}=useContrat();
  const navigate=useNavigate()
  const {stats,actualiseState}=useStates()

  const [loadingContrat,setLoadingContrat]=useState(true)
 
  useEffect(()=>{
    fetchBiens()
    fetchContrats(setLoadingContrat)
   
  },[])

  useEffect(() => {
  actualiseState("Biens",biens)
}, [biens]);

 useEffect(() => {
  actualiseState("Contrats actifs",contrats)
}, [contrats]);

  

  const recentActivities = [
    { 
      id: 1, 
      text: 'Contrat signé pour Appartement A', 
      time: 'Il y a 2 heures',
      type: 'contract' 
    },
    { 
      id: 2, 
      text: 'Nouveau locataire ajouté', 
      time: 'Il y a 5 heures',
      type: 'tenant' 
    },
    { 
      id: 3, 
      text: 'Paiement de loyer enregistré', 
      time: 'Il y a 1 jour',
      type: 'payment' 
    },
  ];

  const quickActions = [
    { 
      label: 'Ajouter un bien', 
      icon: HomeIcon, 
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/biens') 
    },
    { 
      label: 'Créer un contrat', 
      icon: ClipboardDocumentListIcon, 
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/contrats')
    },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'contract':
        return <DocumentTextIcon className="w-4 h-4 text-purple-500" />;
      case 'tenant':
        return <UsersIcon className="w-4 h-4 text-green-500" />;
      case 'payment':
        return <CurrencyDollarIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <ClipboardDocumentListIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header avec effet de verre */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Bon retour, {user?.name || "cher utilisateur"} 
              </h1>
              <p className="text-gray-500 mt-1">
                Voici un aperçu de votre gestion immobilière aujourd'hui
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium text-sm shadow-sm">
                {role || "Utilisateur"}
              </span>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm shadow-lg shadow-green-500/30">
                ● Connecté
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques avec animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className={`${stat.color} bg-opacity-10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trendUp 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <h2 className="text-3xl font-bold text-gray-900">{stat.value}</h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions rapides et activités */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Actions rapides */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 px-1">Actions rapides</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`w-full ${action.color} text-white rounded-xl p-4 flex items-center justify-between group transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <span className="font-medium flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {action.label}
                    </span>
                    <PlusIcon className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activités récentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Voir tout
                </button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
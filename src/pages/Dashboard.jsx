// resources/js/pages/Dashboard.jsx

import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

import useDashboardStats from "../hooks/useDashboardStats";

function Dashboard() {
  const { user, role } = useAuthStore();
  const navigate = useNavigate();
  const { 
    stats, 
    recentProjects, 
    recentTasks, 
    upcomingMeetings,
    taskDistribution,
    loading,
    error,
    actualiseDashboard 
  } = useDashboardStats();

  const [selectedPeriod, setSelectedPeriod] = useState('semaine');

  // Actions rapides pour la gestion de projet
  const quickActions = [
    { 
      label: 'Nouveau projet', 
      icon: FolderIcon, 
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/projets/creer') 
    },
    { 
      label: 'Nouvelle tâche', 
      icon: ClipboardDocumentListIcon, 
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/taches/creer')
    },
    { 
      label: 'Nouvelle réunion', 
      icon: CalendarIcon, 
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/reunions')
    },
    { 
      label: 'Envoyer message', 
      icon: ChatBubbleLeftRightIcon, 
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => navigate('/chats')
    }
  ];

  // Récupérer les activités récentes des tâches
  const recentActivities = recentTasks.slice(0, 5).map(task => ({
    id: task.id,
    text: task.nom,
    time: `Échéance: ${task.date_fin || 'Non définie'}`,
    type: getTaskType(task.priorite),
    priority: task.priorite,
    status: task.statut
  }));

  function getTaskType(priority) {
    switch(priority) {
      case 'eleve':
        return 'high';
      case 'moyenne':
        return 'medium';
      case 'faible':
        return 'low';
      default:
        return 'task';
    }
  }

  function getActivityIcon(type) {
    switch(type) {
      case 'high':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'meeting':
        return <CalendarIcon className="w-4 h-4 text-purple-500" />;
      default:
        return <ClipboardDocumentListIcon className="w-4 h-4 text-gray-500" />;
    }
  }

  function getPriorityColor(priority) {
    switch(priority) {
      case 'eleve': return 'text-red-600 bg-red-50';
      case 'moyenne': return 'text-yellow-600 bg-yellow-50';
      case 'faible': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }

  function getPriorityLabel(priority) {
    switch(priority) {
      case 'eleve': return 'Haute';
      case 'moyenne': return 'Moyenne';
      case 'faible': return 'Basse';
      default: return priority;
    }
  }

  function getStatusColor(status) {
    const colors = {
      'en cours': 'bg-blue-100 text-blue-700',
      'terminée': 'bg-green-100 text-green-700',
      'en attente': 'bg-yellow-100 text-yellow-700',
      'prevu': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || colors['prevu'];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={actualiseDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header avec effet de verre */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tableau de bord, {user?.name || "cher collaborateur"} 
              </h1>
              <p className="text-gray-500 mt-1">
                Gérez vos projets, tâches et collaborations en un coup d'œil
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="trimestre">Ce trimestre</option>
              </select>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium text-sm shadow-sm">
                {role && role.length > 0 ? role.join(", ") : "Membre"}
              </span>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm shadow-lg shadow-green-500/30">
                ● Actif
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques avec animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            // Mapping des icônes
            const IconComponent = {
              FolderIcon: FolderIcon,
              CheckCircleIcon: CheckCircleIcon,
              ClipboardCheckIcon: CheckCircleIcon,
              ChatBubbleLeftRightIcon: ChatBubbleLeftRightIcon
            }[stat.icon] || HomeIcon;
            
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className={`${stat.color} bg-opacity-10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
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

        {/* Distribution des tâches */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Distribution des tâches</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                En cours: {taskDistribution.en_cours || 0}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                Terminées: {taskDistribution.terminee || 0}
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                En attente: {taskDistribution.en_attente || 0}
              </span>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progression globale</span>
                <span>
                  {Math.round(
                    ((taskDistribution.terminee || 0) / 
                    ((taskDistribution.en_cours || 0) + (taskDistribution.terminee || 0) + (taskDistribution.en_attente || 0))) * 100
                  ) || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((taskDistribution.terminee || 0) / 
                      ((taskDistribution.en_cours || 0) + (taskDistribution.terminee || 0) + (taskDistribution.en_attente || 0))) * 100 || 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
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

          {/* Tâches récentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tâches récentes</h2>
                <button 
                  onClick={() => navigate('/listeMyTachesSoustaches')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Voir tout
                </button>
              </div>

              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Aucune tâche récente</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => navigate(`/taches/${activity.id}`)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(activity.priority)}`}>
                            {getPriorityLabel(activity.priority)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <ArrowTrendingUpIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Projets récents */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Projets récents</h2>
            <button 
              onClick={() => navigate('/Projet')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Voir tous les projets
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.length === 0 ? (
              <p className="text-center text-gray-500 col-span-3 py-8">Aucun projet récent</p>
            ) : (
              recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate(`/projets/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{project.nom}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(project.statut)}`}>
                      {project.statut}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progression</span>
                      <span className="font-medium text-gray-700">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Réunions à venir */}
        {upcomingMeetings.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                Réunions à venir
              </h2>
              <button 
                onClick={() => navigate('/reunions')}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Voir le calendrier
              </button>
            </div>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="bg-white rounded-xl p-4 flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Date(meeting.date).getDate()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(meeting.date).toLocaleString('fr', { month: 'short' })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{meeting.objetif}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(meeting.heure_debut).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {meeting.lieu_ou_lien && (
                      <a 
                        href={meeting.lieu_ou_lien} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {meeting.lieu_ou_lien.includes('http') ? 'Lien de réunion' : meeting.lieu_ou_lien}
                      </a>
                    )}
                  </div>
                  <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors">
                    Participer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
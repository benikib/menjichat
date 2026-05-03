// resources/js/pages/Reports.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ArrowPathIcon,
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import useReportStore from '../store/useReportStore';
import useAuthStore from '../store/useAuthStore';

function Reports() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reportData, loading, error, fetchReport, fetchCustomReport, exportReport, currentPeriod } = useReportStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [dateParams, setDateParams] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    week: getWeekNumber(new Date()),
    quarter: Math.ceil((new Date().getMonth() + 1) / 3),
    semester: new Date().getMonth() + 1 <= 6 ? 1 : 2
  });
  const [customRange, setCustomRange] = useState({
    start_date: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  useEffect(() => {
    loadReport();
  }, [selectedPeriod, dateParams]);

  function getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  const loadReport = () => {
    const params = { ...dateParams };
    fetchReport(selectedPeriod, params);
  };

  const handleCustomReport = () => {
    fetchCustomReport(customRange.start_date, customRange.end_date);
    setShowCustomPicker(false);
  };

  const handleExport = () => {
    const period = currentPeriod === 'custom' ? selectedPeriod : currentPeriod;
    exportReport(period, dateParams);
  };

  const periodOptions = [
    { value: 'daily', label: 'Journalier', icon: CalendarIcon },
    { value: 'weekly', label: 'Hebdomadaire', icon: CalendarIcon },
    { value: 'monthly', label: 'Mensuel', icon: CalendarIcon },
    { value: 'quarterly', label: 'Trimestriel', icon: ChartBarIcon },
    { value: 'semester', label: 'Semestriel', icon: ChartBarIcon },
    { value: 'annual', label: 'Annuel', icon: ChartBarIcon }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Génération du rapport...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <PresentationChartLineIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rapports & Analyses</h1>
                <p className="text-sm text-gray-500">Visualisez les performances globales de l'application</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Exporter CSV
              </button>
              <button
                onClick={loadReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Actualiser
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Période Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap gap-3">
            {periodOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedPeriod === option.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <option.icon className="w-4 h-4" />
                {option.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustomPicker(!showCustomPicker)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                showCustomPicker || currentPeriod === 'custom'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Personnalisé
            </button>
          </div>

          {/* Paramètres de période */}
          {selectedPeriod !== 'custom' && !showCustomPicker && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
              {selectedPeriod === 'weekly' && (
                <select
                  value={dateParams.week}
                  onChange={(e) => setDateParams({ ...dateParams, week: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {[...Array(52)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Semaine {i + 1}</option>
                  ))}
                </select>
              )}
              
              {(selectedPeriod === 'monthly' || selectedPeriod === 'quarterly' || selectedPeriod === 'semester') && (
                <select
                  value={dateParams.month}
                  onChange={(e) => setDateParams({ ...dateParams, month: parseInt(e.target.value) })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {selectedPeriod === 'quarterly' ? (
                    <>
                      <option value={1}>Trimestre 1 (Jan-Mar)</option>
                      <option value={2}>Trimestre 2 (Avr-Juin)</option>
                      <option value={3}>Trimestre 3 (Juil-Sep)</option>
                      <option value={4}>Trimestre 4 (Oct-Déc)</option>
                    </>
                  ) : selectedPeriod === 'semester' ? (
                    <>
                      <option value={1}>Semestre 1 (Jan-Juin)</option>
                      <option value={2}>Semestre 2 (Juil-Déc)</option>
                    </>
                  ) : (
                    [...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i, 1).toLocaleString('fr', { month: 'long' })}
                      </option>
                    ))
                  )}
                </select>
              )}
              
              <select
                value={dateParams.year}
                onChange={(e) => setDateParams({ ...dateParams, year: parseInt(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          )}

          {/* Période personnalisée */}
          {(showCustomPicker || currentPeriod === 'custom') && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date début</label>
                <input
                  type="date"
                  value={customRange.start_date}
                  onChange={(e) => setCustomRange({ ...customRange, start_date: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date fin</label>
                <input
                  type="date"
                  value={customRange.end_date}
                  onChange={(e) => setCustomRange({ ...customRange, end_date: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={handleCustomReport}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Générer
              </button>
            </div>
          )}
        </div>

        {reportData && (
          <>
            {/* Période actuelle */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Période du rapport</p>
                  <h2 className="text-2xl font-bold mt-1">{reportData.period.label}</h2>
                  <p className="text-blue-100 mt-2">
                    Du {new Date(reportData.period.start_date).toLocaleDateString('fr-FR')} 
                    au {new Date(reportData.period.end_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <PresentationChartLineIcon className="w-8 h-8" />
                </div>
              </div>
            </div>

            {/* Cartes de résumé */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <FolderIcon className="w-8 h-8 text-blue-500" />
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +{reportData.summary.new_projects}
                  </span>
                </div>
                <p className="text-2xl font-bold mt-3">{reportData.summary.total_projects}</p>
                <p className="text-sm text-gray-500">Projets totaux</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <CheckCircleIcon className="w-8 h-8 text-green-500" />
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {reportData.performance.task_completion_rate}%
                  </span>
                </div>
                <p className="text-2xl font-bold mt-3">{reportData.summary.completed_tasks}</p>
                <p className="text-sm text-gray-500">Tâches terminées</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-500" />
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    +{reportData.summary.new_messages}
                  </span>
                </div>
                <p className="text-2xl font-bold mt-3">{reportData.summary.total_messages}</p>
                <p className="text-sm text-gray-500">Messages</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <UserGroupIcon className="w-8 h-8 text-orange-500" />
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +{reportData.summary.new_users}
                  </span>
                </div>
                <p className="text-2xl font-bold mt-3">{reportData.summary.total_users}</p>
                <p className="text-sm text-gray-500">Utilisateurs</p>
              </div>
            </div>

            {/* Graphique d'évolution */}
            {reportData.chart_data.tasks_trend.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des tâches</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={reportData.chart_data.tasks_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="created" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Créées" />
                    <Area type="monotone" dataKey="completed" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Terminées" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution des projets */}
              {reportData.chart_data.projects_distribution.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Projets par statut</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.chart_data.projects_distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="statut"
                      >
                        {reportData.chart_data.projects_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Priorité des tâches */}
              {reportData.chart_data.priority_distribution.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tâches par priorité</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.chart_data.priority_distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="priorite" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#8B5CF6" name="Nombre de tâches" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Comparaison mensuelle */}
            {reportData.chart_data.monthly_comparison.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison mensuelle</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={reportData.chart_data.monthly_comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total_tasks" stroke="#3B82F6" name="Tâches totales" />
                    <Line type="monotone" dataKey="completed_tasks" stroke="#10B981" name="Tâches terminées" />
                    <Line type="monotone" dataKey="completion_rate" stroke="#F59E0B" name="Taux de complétion (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Utilisateurs actifs */}
            {reportData.users.top_active.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs les plus actifs</h3>
                <div className="space-y-3">
                  {reportData.users.top_active.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{user.total_activities}</p>
                        <p className="text-xs text-gray-500">activités</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Métriques de performance */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Métriques de performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{reportData.performance.task_completion_rate}%</p>
                  <p className="text-sm text-gray-300">Taux de complétion</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{reportData.performance.average_tasks_per_project}</p>
                  <p className="text-sm text-gray-300">Tâches/projet</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{reportData.performance.average_messages_per_day}</p>
                  <p className="text-sm text-gray-300">Messages/jour</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{reportData.documents.total_size}</p>
                  <p className="text-sm text-gray-300">Stockage utilisé</p>
                </div>
              </div>
            </div>

            {/* Détail des projets */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression des projets</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projet</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tâches</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progression</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.projects.progress.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/projets/${project.id}`)}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.nom}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.statut === 'En cours' ? 'bg-blue-100 text-blue-700' :
                            project.statut === 'Terminé' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {project.statut || 'En cours'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.completed_tasks}/{project.total_tasks}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">{error}</p>
            <button onClick={loadReport} className="mt-2 text-red-600 underline">Réessayer</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
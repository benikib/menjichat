// resources/js/hooks/useDashboardStats.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import useDashboardStore from '../store/useDashboardStore';

const useDashboardStats = () => {
  const { 
    stats, 
    recentProjects, 
    recentTasks, 
    upcomingMeetings,
    taskDistribution,
    loading, 
    error,
    fetchDashboard,
    actualiseDashboard
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    stats,
    recentProjects,
    recentTasks,
    upcomingMeetings,
    taskDistribution,
    loading,
    error,
    actualiseDashboard
  };
};

export default useDashboardStats;
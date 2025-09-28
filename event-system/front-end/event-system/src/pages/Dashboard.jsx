// Dashboard.jsx
// Black & white analytics dashboard shell

import { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Toast from '../components/common/Toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        const overview = res?.data?.overview || res?.overview || res;
        setStats(overview);
      })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      {loading && <Loader />}
      {error && <Toast message={error} onClose={() => setError('')} />}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="flex flex-col items-center">
              <div className="text-2xl font-bold text-white">{stats.totalResponses ?? 0}</div>
              <div className="text-gray-300">Total Responses</div>
            </Card>
            <Card className="flex flex-col items-center">
              <div className="text-2xl font-bold text-white">{
                (() => {
                  const totalForms = stats.totalForms ?? 0;
                  const totalResponses = stats.totalResponses ?? 0;
                  if (!totalForms) return 0;
                  return Math.round((totalResponses / totalForms) * 100);
                })()
              }%</div>
              <div className="text-gray-300">Response Rate</div>
            </Card>
            <Card className="flex flex-col items-center">
              <div className="text-2xl font-bold text-white">{stats.certificatesSent ?? 0}</div>
              <div className="text-gray-300">Certificates Delivered</div>
            </Card>
            <Card className="flex flex-col items-center">
              <div className="text-2xl font-bold text-white">{stats.totalForms ?? 0}</div>
              <div className="text-gray-300">Active Forms</div>
            </Card>
          </div>
          {/* Charts placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="h-64 flex items-center justify-center text-gray-400">Bar Chart (Responses Over Time)</Card>
            <Card className="h-64 flex items-center justify-center text-gray-400">Pie Chart (Satisfaction Scores)</Card>
          </div>
          <Card className="h-64 flex items-center justify-center text-gray-400 mt-8">Line Chart (Response Rate Trend)</Card>
        </>
      )}
    </div>
  );
}

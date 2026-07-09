import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-text dark:text-gray-400">Loading dashboard...</div>;
  if (!stats) return <div className="text-danger">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon="🔧" label="Total Tools" value={stats.totalTools} color="blue" />
        <StatCard icon="✅" label="IN Tools" value={stats.inTools} color="green" />
        <StatCard icon="📤" label="OUT Tools" value={stats.outTools} color="blue" />
        <StatCard icon="⚠️" label="Damaged" value={stats.damagedTools} color="red" />
        <StatCard icon="📦" label="Available Stock" value={stats.availableStock} color="orange" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-border dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-divider dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-dark dark:text-white">Recent IN/OUT Activity</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-light dark:text-gray-400 uppercase text-xs tracking-wider border-b border-gray-divider dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Part No.</th>
                <th className="px-6 py-3 font-semibold">Tool Name</th>
                <th className="px-6 py-3 font-semibold">Action</th>
                <th className="px-6 py-3 font-semibold">Person</th>
                <th className="px-6 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-divider dark:divide-gray-700">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-3.5 text-gray-dark dark:text-white font-medium">{activity.part_number || '—'}</td>
                    <td className="px-6 py-3.5 text-gray-text dark:text-gray-300">{activity.tool_name}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${
                        activity.action === 'IN'
                          ? 'bg-success-light text-success dark:bg-green-900 dark:text-green-300'
                          : 'bg-primary-light text-primary dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {activity.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-text dark:text-gray-300">{activity.person_name}</td>
                    <td className="px-6 py-3.5 text-gray-light dark:text-gray-400">
                      {new Date(activity.created_at).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-light dark:text-gray-500 italic text-xs">
                    No recent activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

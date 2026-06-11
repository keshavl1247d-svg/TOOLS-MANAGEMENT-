import React, { useState } from 'react';
import api from '../api/axios';
import { useToast } from '../components/Toast';

const Reports = () => {
  const addToast = useToast();
  const [reportType, setReportType] = useState('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthYear, setMonthYear] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'daily') {
        const res = await api.get(`/reports/daily?date=${date}`);
        setData(res.data);
      } else {
        const [year, month] = monthYear.split('-');
        const res = await api.get(`/reports/monthly?month=${month}&year=${year}`);
        setData(res.data);
      }
    } catch (error) {
      addToast('Error generating report', 'error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-dark mb-4">Generate Report</h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-text mb-1.5">Report Type</label>
            <select 
              value={reportType} 
              onChange={e => { setReportType(e.target.value); setData(null); }} 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
            >
              <option value="daily">Daily Activity Report</option>
              <option value="monthly">Monthly Summary Report</option>
            </select>
          </div>

          <div className="w-full md:w-1/3">
            {reportType === 'daily' ? (
              <>
                <label className="block text-sm font-medium text-gray-text mb-1.5">Select Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-text mb-1.5">Select Month</label>
                <input 
                  type="month" 
                  value={monthYear} 
                  onChange={e => setMonthYear(e.target.value)} 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </>
            )}
          </div>

          <div className="w-full md:w-1/3">
            <button 
              onClick={fetchReport}
              disabled={loading || (reportType === 'daily' ? !date : !monthYear)}
              className={`w-full py-2.5 rounded-lg text-white font-medium transition-all shadow-sm
                ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark hover:shadow-md'}`}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {data && reportType === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-border flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-light font-medium uppercase tracking-wider mb-1">Tools Issued</p>
                <h3 className="text-3xl font-bold text-primary">{data.issuedCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-2xl">📤</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-border flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-light font-medium uppercase tracking-wider mb-1">Tools Returned</p>
                <h3 className="text-3xl font-bold text-success">{data.returnedCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center text-2xl">📥</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-border flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-light font-medium uppercase tracking-wider mb-1">Damaged Tools</p>
                <h3 className="text-3xl font-bold text-danger">{data.damagedCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center text-2xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-divider">
              <h3 className="text-lg font-semibold text-gray-dark">Activity Log - {date}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-light uppercase text-xs tracking-wider border-b border-gray-divider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Time</th>
                    <th className="px-6 py-3 font-semibold">Tool</th>
                    <th className="px-6 py-3 font-semibold">Action</th>
                    <th className="px-6 py-3 font-semibold">Person</th>
                    <th className="px-6 py-3 font-semibold">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-divider">
                  {data.activities.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-light italic">No activity recorded for this date.</td></tr>
                  ) : (
                    data.activities.map((act, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-3 text-gray-text">
                          {new Date(act.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-3 text-gray-dark font-medium">{act.tool_number} - {act.tool_name}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${act.action === 'IN' ? 'bg-success-light text-success' : 'bg-primary-light text-primary'}`}>
                            {act.action}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-text">{act.person_name}</td>
                        <td className="px-6 py-3 text-gray-text">{act.condition_status || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {data && reportType === 'monthly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-border">
              <p className="text-sm text-gray-light font-medium uppercase tracking-wider mb-1">Total Issues</p>
              <h3 className="text-2xl font-bold text-gray-dark">{data.totalIssues}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-border">
              <p className="text-sm text-gray-light font-medium uppercase tracking-wider mb-1">Total Returns</p>
              <h3 className="text-2xl font-bold text-gray-dark">{data.totalReturns}</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-border col-span-2">
              <p className="text-sm text-gray-light font-medium uppercase tracking-wider mb-1">Most Issued Tool</p>
              <h3 className="text-2xl font-bold text-primary">{data.mostIssuedTool}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-divider">
              <h3 className="text-lg font-semibold text-gray-dark">Tool Usage Summary - {monthYear}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-light uppercase text-xs tracking-wider border-b border-gray-divider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Tool Name</th>
                    <th className="px-6 py-3 font-semibold text-center">Times Issued</th>
                    <th className="px-6 py-3 font-semibold text-center">Times Returned</th>
                    <th className="px-6 py-3 font-semibold text-center text-danger">Damaged Returns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-divider">
                  {data.summary.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-light italic">No data for this month.</td></tr>
                  ) : (
                    data.summary.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-3 text-gray-dark font-medium">{row.toolName}</td>
                        <td className="px-6 py-3 text-center text-gray-text">{row.totalIssues}</td>
                        <td className="px-6 py-3 text-center text-gray-text">{row.totalReturns}</td>
                        <td className={`px-6 py-3 text-center font-medium ${row.damagedReturns > 0 ? 'text-danger' : 'text-gray-text'}`}>
                          {row.damagedReturns}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

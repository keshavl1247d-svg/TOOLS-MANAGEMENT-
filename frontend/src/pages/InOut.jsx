import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useToast } from '../components/Toast';

const InOut = () => {
  const addToast = useToast();
  const [tools, setTools] = useState([]);
  const [action, setAction] = useState('OUT');
  const [formData, setFormData] = useState({ tool_id: '', person_name: '', condition_status: 'Good', notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await api.get('/tools');
        setTools(res.data);
      } catch (error) {
        addToast('Failed to load tools', 'error');
      }
    };
    fetchTools();
  }, [addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tool_id || !formData.person_name) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    const selectedTool = tools.find(t => t.id === parseInt(formData.tool_id));
    if (!selectedTool) return;
    if (action === 'OUT' && selectedTool.status !== 'IN') {
      addToast('Tool is not currently IN', 'error');
      return;
    }
    if (action === 'IN' && selectedTool.status !== 'OUT') {
      addToast('Tool is not currently OUT', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, part_id: selectedTool.part_id };
      await api.post(`/inout/${action.toLowerCase()}`, payload);
      addToast(`Tool successfully ${action === 'OUT' ? 'issued' : 'returned'}`);
      setTools(tools.map(t => t.id === parseInt(formData.tool_id)
        ? { ...t, status: action === 'IN' ? (formData.condition_status === 'Damaged' ? 'Damaged' : 'IN') : 'OUT' }
        : t
      ));
      setFormData({ tool_id: '', person_name: '', condition_status: 'Good', notes: '' });
    } catch (error) {
      addToast(error.response?.data?.message || `Error ${action === 'OUT' ? 'issuing' : 'returning'} tool`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = tools.filter(t => action === 'OUT' ? t.status === 'IN' : t.status === 'OUT');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex bg-gray-divider dark:bg-gray-700 rounded-lg p-1 w-full max-w-sm mx-auto shadow-sm">
        <button
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${action === 'OUT' ? 'bg-white dark:bg-gray-800 shadow text-primary' : 'text-gray-text dark:text-gray-400 hover:text-gray-dark dark:hover:text-white'}`}
          onClick={() => { setAction('OUT'); setFormData({...formData, tool_id: ''}); }}
        >
          Issue Tool (OUT)
        </button>
        <button
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${action === 'IN' ? 'bg-white dark:bg-gray-800 shadow text-success' : 'text-gray-text dark:text-gray-400 hover:text-gray-dark dark:hover:text-white'}`}
          onClick={() => { setAction('IN'); setFormData({...formData, tool_id: ''}); }}
        >
          Return Tool (IN)
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-border dark:border-gray-700 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-dark dark:text-white mb-6">
          {action === 'OUT' ? 'Issue Tool to User' : 'Return Tool to Inventory'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-text dark:text-gray-300 mb-1.5">Select Tool *</label>
            <select
              value={formData.tool_id}
              onChange={e => setFormData({...formData, tool_id: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-border dark:border-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white dark:bg-gray-700 dark:text-white transition-all"
              required
            >
              <option value="">-- Choose a tool --</option>
              {filteredTools.map(t => (
                <option key={t.id} value={t.id}>{t.tool_number} - {t.tool_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-text dark:text-gray-300 mb-1.5">Person Name *</label>
            <input
              type="text"
              value={formData.person_name}
              onChange={e => setFormData({...formData, person_name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-border dark:border-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-gray-700 dark:text-white transition-all"
              placeholder={action === 'OUT' ? "Who is taking this tool?" : "Who is returning this tool?"}
              required
            />
          </div>

          {action === 'IN' && (
            <div>
              <label className="block text-sm font-medium text-gray-text dark:text-gray-300 mb-1.5">Condition *</label>
              <select
                value={formData.condition_status}
                onChange={e => setFormData({...formData, condition_status: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-border dark:border-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="Good">Good / Working</option>
                <option value="Damaged">Damaged / Needs Repair</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-text dark:text-gray-300 mb-1.5">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-border dark:border-gray-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:bg-gray-700 dark:text-white transition-all resize-none h-24"
              placeholder="Any additional information..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition-all shadow-sm
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}
              ${action === 'OUT' ? 'bg-primary hover:bg-primary-dark' : 'bg-success hover:bg-success-dark'}`}
          >
            {loading ? 'Processing...' : (action === 'OUT' ? 'Confirm Issue (OUT)' : 'Confirm Return (IN)')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InOut;

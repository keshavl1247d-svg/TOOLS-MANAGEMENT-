import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const Tools = () => {
  const { isAdmin } = useAuth();
  const addToast = useToast();
  const [tools, setTools] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [formData, setFormData] = useState({ tool_number: '', tool_name: '', part_id: '', status: 'IN' });

  const fetchData = async () => {
    try {
      const [toolsRes, partsRes] = await Promise.all([api.get('/tools'), api.get('/parts')]);
      setTools(toolsRes.data);
      setParts(partsRes.data);
    } catch (error) {
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (tool = null) => {
    setEditingTool(tool);
    if (tool) {
      setFormData({
        tool_number: tool.tool_number,
        tool_name: tool.tool_name,
        part_id: tool.part_id || '',
        status: tool.status
      });
    } else {
      setFormData({ tool_number: '', tool_name: '', part_id: '', status: 'IN' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tool_number || !formData.tool_name) {
      addToast('Tool number and name are required', 'error');
      return;
    }

    try {
      if (editingTool) {
        await api.put(`/tools/${editingTool.id}`, formData);
        addToast('Tool updated successfully');
      } else {
        await api.post('/tools', formData);
        addToast('Tool added successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Error saving tool', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/tools/${id}`);
      addToast('Tool deleted successfully');
      fetchData();
    } catch (error) {
      addToast('Error deleting tool', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-dark">Tools Management</h2>
        {isAdmin && (
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            ＋ Add Tool
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-light uppercase text-xs tracking-wider border-b border-gray-divider">
              <tr>
                <th className="px-6 py-3 font-semibold">Tool No.</th>
                <th className="px-6 py-3 font-semibold">Tool Name</th>
                <th className="px-6 py-3 font-semibold">Linked Part</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                {isAdmin && <th className="px-6 py-3 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-divider">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-text">Loading tools...</td></tr>
              ) : tools.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-light italic">No tools found.</td></tr>
              ) : (
                tools.map(tool => (
                  <tr key={tool.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-gray-dark font-medium">{tool.tool_number}</td>
                    <td className="px-6 py-3.5 text-gray-text">{tool.tool_name}</td>
                    <td className="px-6 py-3.5 text-gray-text">
                      {tool.part_number ? `${tool.part_number} - ${tool.part_name}` : <span className="text-gray-light italic">Unlinked</span>}
                    </td>
                    <td className="px-6 py-3.5"><StatusBadge status={tool.status} /></td>
                    {isAdmin && (
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(tool)} className="w-8 h-8 rounded bg-primary-light text-primary hover:bg-primary/20 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={() => handleDelete(tool.id, tool.tool_name)} className="w-8 h-8 rounded bg-danger-light text-danger hover:bg-danger/20 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTool ? 'Edit Tool' : 'Add Tool'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-text uppercase tracking-wide mb-1.5">Tool Number *</label>
            <input type="text" value={formData.tool_number} onChange={e => setFormData({...formData, tool_number: e.target.value})} className="w-full px-3 py-2 border border-gray-border rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-text uppercase tracking-wide mb-1.5">Tool Name *</label>
            <input type="text" value={formData.tool_name} onChange={e => setFormData({...formData, tool_name: e.target.value})} className="w-full px-3 py-2 border border-gray-border rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-text uppercase tracking-wide mb-1.5">Linked Part</label>
            <select value={formData.part_id} onChange={e => setFormData({...formData, part_id: e.target.value})} className="w-full px-3 py-2 border border-gray-border rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white">
              <option value="">-- None --</option>
              {parts.map(part => (
                <option key={part.id} value={part.id}>{part.part_number} - {part.part_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-text uppercase tracking-wide mb-1.5">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-border rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white">
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-divider mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-text bg-gray-50 hover:bg-gray-200 rounded transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded transition-colors">Save Tool</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tools;

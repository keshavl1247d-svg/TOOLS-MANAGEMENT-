import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import Lightbox from '../components/Lightbox';

const Parts = () => {
  const { isAdmin } = useAuth();
  const addToast = useToast();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [formData, setFormData] = useState({
    part_number: '', part_name: '', quantity: 0, location: '', status: 'Available'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [lightboxData, setLightboxData] = useState({ isOpen: false, src: '' });
  const fileInputRef = useRef(null);

  const fetchParts = async () => {
    try {
      const res = await api.get('/parts');
      setParts(res.data);
    } catch (error) {
      addToast('Failed to load parts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParts(); }, []);

  const handleOpenModal = (part = null) => {
    setEditingPart(part);
    if (part) {
      setFormData({
        part_number: part.part_number,
        part_name: part.part_name,
        quantity: part.quantity,
        location: part.location || '',
        status: part.status
      });
      setPreviewUrl(part.photo || '');
    } else {
      setFormData({ part_number: '', part_name: '', quantity: 0, location: '', status: 'Available' });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('File too large, max 5MB', 'error');
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.part_number || !formData.part_name) {
      addToast('Part number and name are required', 'error');
      return;
    }
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (selectedFile) data.append('photo', selectedFile);
    try {
      if (editingPart) {
        await api.put(`/parts/${editingPart.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        addToast('Part updated successfully');
      } else {
        await api.post('/parts', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        addToast('Part added successfully');
      }
      handleCloseModal();
      fetchParts();
    } catch (error) {
      addToast(error.response?.data?.message || 'Error saving part', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/parts/${id}`);
      addToast('Part deleted successfully');
      fetchParts();
    } catch (error) {
      addToast('Error deleting part', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-dark dark:text-white">Part Management</h2>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            ＋ Add Part
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-border dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-light dark:text-gray-400 uppercase text-xs tracking-wider border-b border-gray-divider dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Part No.</th>
                <th className="px-6 py-3 font-semibold">Part Name</th>
                <th className="px-6 py-3 font-semibold">Qty</th>
                <th className="px-6 py-3 font-semibold">Location</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-center">Photo</th>
                {isAdmin && <th className="px-6 py-3 font-semibold text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-divider dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-text dark:text-gray-400">Loading parts...</td></tr>
              ) : parts.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-light dark:text-gray-500 italic">No parts found.</td></tr>
              ) : (
                parts.map(part => (
                  <tr key={part.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-3.5 text-gray-dark dark:text-white font-medium">{part.part_number}</td>
                    <td className="px-6 py-3.5 text-gray-text dark:text-gray-300">{part.part_name}</td>
                    <td className="px-6 py-3.5 text-gray-text dark:text-gray-300">{part.quantity}</td>
                    <td className="px-6 py-3.5 text-gray-text dark:text-gray-300">{part.location || '—'}</td>
                    <td className="px-6 py-3.5"><StatusBadge status={part.status} /></td>
                    <td className="px-6 py-3.5 flex justify-center">
                      {part.photo ? (
                        <img
                          src={`/uploads/${part.photo}`}
                          alt={part.part_name}
                          className="w-10 h-10 object-cover rounded-full border border-gray-divider cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                         onClick={() => setLightboxData({ isOpen: true, src: part.photo })}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleOpenModal(part)} className="w-8 h-8 rounded bg-primary-light text-primary hover:bg-primary/20 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={() => handleDelete(part.id, part.part_name)} className="w-8 h-8 rounded bg-danger-light text-danger hover:bg-danger/20 flex items-center justify-center transition-colors">
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPart ? 'Edit Part' : 'Add Part'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-text dark:text-gray-300 uppercase tracking-wide mb-1.5">Part Number *</label>
              <input type="text" value={formData.part_number} onChange={e => setFormData({...formData, part_number: e.target.value})} className="w-full px-3 py-2 border border-gray-border dark:border-gray-600 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-gray-700 dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-text dark:text-gray-300 uppercase tracking-wide mb-1.5">Quantity</label>
              <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full px-3 py-2 border border-gray-border dark:border-gray-600 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-gray-700 dark:text-white" min="0" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-text dark:text-gray-300 uppercase tracking-wide mb-1.5">Part Name *</label>
            <input type="text" value={formData.part_name} onChange={e => setFormData({...formData, part_name: e.target.value})} className="w-full px-3 py-2 border border-gray-border dark:border-gray-600 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-gray-700 dark:text-white" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-text dark:text-gray-300 uppercase tracking-wide mb-1.5">Location</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-border dark:border-gray-600 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-text dark:text-gray-300 uppercase tracking-wide mb-1.5">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-border dark:border-gray-600 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white dark:bg-gray-700 dark:text-white">
                <option value="Available">Available</option>
                <option value="Out">Out</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-text dark:text-gray-300 uppercase tracking-wide mb-1.5">Photo</label>
            <div className="mt-1 flex items-center gap-4">
              {previewUrl ? (
                <div className="relative w-16 h-16 rounded border border-gray-divider overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded border border-gray-divider dark:border-gray-600 bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-light text-xs">No img</div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="text-sm text-gray-text file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-primary/20"
              />
            </div>
            <p className="mt-1 text-xs text-gray-light dark:text-gray-500">Max size: 5MB. Formats: JPG, PNG, WEBP.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-divider dark:border-gray-700 mt-6">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-text dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded transition-colors">Save Part</button>
          </div>
        </form>
      </Modal>

      <Lightbox isOpen={lightboxData.isOpen} src={lightboxData.src} onClose={() => setLightboxData({ isOpen: false, src: '' })} />
    </div>
  );
};

export default Parts;

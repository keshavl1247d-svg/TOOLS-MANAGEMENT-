import React, { useState } from 'react';
import api from '../api/axios';
import { useToast } from '../components/Toast';
import StatusBadge from '../components/StatusBadge';
import Lightbox from '../components/Lightbox';

const Search = () => {
  const addToast = useToast();
  const [searchType, setSearchType] = useState('tool_name');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lightboxData, setLightboxData] = useState({ isOpen: false, src: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/search?type=${searchType}&q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (error) {
      addToast('Error performing search', 'error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-border rounded-xl shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <select 
              value={searchType} 
              onChange={e => setSearchType(e.target.value)} 
              className="w-full px-4 py-2.5 rounded-lg border border-gray-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
            >
              <option value="tool_name">Search by Tool Name</option>
              <option value="part_name">Search by Part Name</option>
              <option value="part_number">Search by Part Number</option>
            </select>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <input 
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
              placeholder="Enter search term..."
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          
          <div className="w-full md:w-1/4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full h-full py-2.5 rounded-lg text-white font-medium transition-all shadow-sm
                ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark hover:shadow-md'}`}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-divider flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-dark">Search Results ({results.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-light uppercase text-xs tracking-wider border-b border-gray-divider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Photo</th>
                  <th className="px-6 py-3 font-semibold">Part No.</th>
                  <th className="px-6 py-3 font-semibold">Part/Tool Name</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold text-center">Qty</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-divider">
                {results.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-light italic">No matching records found.</td></tr>
                ) : (
                  results.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        {result.photo ? (
                          <img 
                            src={`/uploads/${result.photo}`} 
                            alt={result.partName || result.toolName} 
                            className="w-10 h-10 object-cover rounded border border-gray-divider cursor-pointer hover:opacity-80"
                            onClick={() => setLightboxData({ isOpen: true, src: `/uploads/${result.photo}` })}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                            <span className="text-xs">No img</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-gray-dark font-medium">{result.partNo || '—'}</td>
                      <td className="px-6 py-3.5">
                        <div className="text-gray-dark font-medium">{result.toolName || '—'}</div>
                        {result.partName && <div className="text-xs text-gray-light mt-0.5">{result.partName}</div>}
                      </td>
                      <td className="px-6 py-3.5 text-gray-text">{result.location || '—'}</td>
                      <td className="px-6 py-3.5 text-gray-text text-center">{result.quantity || '—'}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={result.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Lightbox isOpen={lightboxData.isOpen} src={lightboxData.src} onClose={() => setLightboxData({ isOpen: false, src: '' })} />
    </div>
  );
};

export default Search;

import React, { useMemo, useState } from 'react';
import { AnalyzedCase } from '../types';
import { SupremeCourtIcon, HighCourtIcon, LocalCourtIcon, FastTrackIcon } from './icons';
import CaseResultCard from './CaseResultCard';

interface ResultsDashboardProps {
  analyzedCases: AnalyzedCase[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

type Court = 'Supreme Court' | 'High Court' | 'Local Court' | 'FastTrack Zone';
const courts: Court[] = ['Supreme Court', 'High Court', 'Local Court', 'FastTrack Zone'];
const courtIcons: Record<Court, React.ReactNode> = {
  'Supreme Court': <SupremeCourtIcon className="w-5 h-5 mr-2" />,
  'High Court': <HighCourtIcon className="w-5 h-5 mr-2" />,
  'Local Court': <LocalCourtIcon className="w-5 h-5 mr-2" />,
  'FastTrack Zone': <FastTrackIcon className="w-5 h-5 mr-2" />,
};

const caseCategories: Array<AnalyzedCase['category']> = ['Criminal', 'Civil', 'Constitutional', 'Corporate', 'Family', 'Tax', 'Other'];
type PriorityFilter = 'All' | 'Urgent' | 'High' | 'Medium' | 'Low';

const ITEMS_PER_PAGE = 10;

const CategoryChart: React.FC<{data: Record<string, number>}> = ({ data }) => {
    // FIX for error on line 27: Operator '+' cannot be applied to types 'unknown' and 'unknown'.
    // And error on line 29: Argument of type 'unknown' is not assignable to parameter of type 'number'.
    // We cast the values to number[] to ensure correct type inference for reduce and Math.max.
    const dataValues = Object.values(data) as number[];
    const total = dataValues.reduce((sum, count) => sum + count, 0);
    if (total === 0) return null;
    const max = Math.max(...dataValues);
    const colors = ['bg-blue-500', 'bg-sky-500', 'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500', 'bg-green-500', 'bg-lime-500'];

    return (
        <div className="space-y-2">
            {Object.entries(data).map(([category, count], index) => (
                <div key={category} className="flex items-center text-sm">
                    <span className="w-28 text-slate-600 font-medium truncate">{category}</span>
                    <div className="flex-1 bg-slate-200 rounded-full h-4">
                        {/* FIX for error on line 38: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type. */}
                        <div className={`${colors[index % colors.length]} h-4 rounded-full text-white text-xs flex items-center justify-end pr-2`} style={{ width: `${((count as number) / max) * 100}%` }}>
                            {count}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ analyzedCases, onRefresh, isRefreshing }) => {
  const [activeTab, setActiveTab] = useState<Court>('Supreme Court');
  const [visiblePages, setVisiblePages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState<PriorityFilter>('All');

  const analytics = useMemo(() => {
    const total = analyzedCases.length;
    const urgent = analyzedCases.filter(c => c.priority === 'Urgent').length;
    const high = analyzedCases.filter(c => c.priority === 'High').length;
    const fastTracked = analyzedCases.filter(c => c.fastTrack).length;
    const categoryCounts = analyzedCases.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const top5Urgent = analyzedCases.filter(c => c.priority === 'Urgent').slice(0, 5);

    return { total, urgent, high, fastTracked, categoryCounts, top5Urgent };
  }, [analyzedCases]);

  const filteredAndSortedCases = useMemo(() => {
    let cases = analyzedCases;

    if (activeTab === 'FastTrack Zone') {
        cases = cases.filter(c => c.fastTrack);
    } else {
        cases = cases.filter(c => c.court === activeTab);
    }

    if (selectedCategory !== 'All') {
        cases = cases.filter(c => c.category === selectedCategory);
    }

    if (selectedPriority !== 'All') {
        cases = cases.filter(c => {
            const score = c.priorityScore;
            if (selectedPriority === 'Urgent') return score >= 90;
            if (selectedPriority === 'High') return score >= 70 && score < 90;
            if (selectedPriority === 'Medium') return score >= 40 && score < 70;
            if (selectedPriority === 'Low') return score < 40;
            return true;
        })
    }

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        cases = cases.filter(c => 
            c.id.toLowerCase().includes(lowercasedTerm) ||
            c.summary.toLowerCase().includes(lowercasedTerm) ||
            c.preliminaryAssessment.toLowerCase().includes(lowercasedTerm)
        );
    }

    // Main sort is always by priority score desc
    return cases.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [analyzedCases, activeTab, searchTerm, selectedCategory, selectedPriority]);
  
  const visibleCases = useMemo(() => {
      return filteredAndSortedCases.slice(0, visiblePages * ITEMS_PER_PAGE);
  }, [filteredAndSortedCases, visiblePages]);
  
  const loadMore = () => {
      setVisiblePages(prev => prev + 1);
  };

  const hasMore = visibleCases.length < filteredAndSortedCases.length;
  
  const handleTabClick = (court: Court) => {
    setActiveTab(court);
    setVisiblePages(1); // Reset pagination on tab change
  };
  
  const scrollToCase = (caseId: string) => {
    document.getElementById(caseId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };


  return (
    <div className="space-y-6">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
                 <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Live Analytics</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-medium text-slate-500">Total Analyzed</h4>
                        <p className="text-3xl font-bold text-slate-800">{analytics.total}</p>
                    </div>
                     <div>
                        <h4 className="text-sm font-medium text-slate-500">Fast-Tracked</h4>
                        <p className="text-3xl font-bold text-indigo-600">{analytics.fastTracked}</p>
                    </div>
                     <div>
                        <h4 className="text-sm font-medium text-slate-500">Urgent Priority</h4>
                        <p className="text-3xl font-bold text-red-600">{analytics.urgent}</p>
                    </div>
                     <div>
                        <h4 className="text-sm font-medium text-slate-500">High Priority</h4>
                        <p className="text-3xl font-bold text-orange-500">{analytics.high}</p>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-slate-600 mb-2">Top 5 Urgent Cases</h4>
                    {analytics.top5Urgent.length > 0 ? (
                        <ul className="space-y-1">
                            {analytics.top5Urgent.map(c => (
                                <li key={c.id}><button onClick={() => scrollToCase(c.id)} className="text-sm text-blue-600 hover:underline text-left">{c.id}</button></li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-slate-500">No urgent cases found.</p>}
                 </div>
            </div>
            <div className="lg:col-span-2">
                 <h3 className="font-bold text-lg text-slate-800 border-b pb-2 mb-4">Case Category Breakdown</h3>
                 <CategoryChart data={analytics.categoryCounts} />
            </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4 flex-wrap gap-4">
            <div className="flex space-x-1 flex-wrap gap-1">
              {courts.map(court => (
                <button
                  key={court}
                  onClick={() => handleTabClick(court)}
                  className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                    activeTab === court
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  } ${court === 'FastTrack Zone' && activeTab !== 'FastTrack Zone' ? 'text-red-600 font-bold' : ''}`}
                >
                  {courtIcons[court]}
                  {court}
                </button>
              ))}
            </div>
            <button onClick={onRefresh} disabled={isRefreshing} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center">
              <svg className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-3.181 9.348a8.25 8.25 0 00-11.664 0l-3.18 3.185m3.181-9.348l-3.181-3.183a8.25 8.25 0 0111.664 0l3.18 3.185" /></svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh Manually'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
            <div className="md:col-span-1">
                <input
                    type="text"
                    placeholder="Search by Case ID or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                />
            </div>
             <div className="flex items-center gap-2">
                <label htmlFor="filter-category" className="text-sm font-medium text-slate-600 whitespace-nowrap">Category:</label>
                <select
                    id="filter-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                >
                    <option value="All">All Categories</option>
                    {caseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="filter-priority" className="text-sm font-medium text-slate-600 whitespace-nowrap">Priority:</label>
                <select
                    id="filter-priority"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as PriorityFilter)}
                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                >
                    <option value="All">All Priorities</option>
                    <option value="Urgent">Urgent (90+)</option>
                    <option value="High">High (70-89)</option>
                    <option value="Medium">Medium (40-69)</option>
                    <option value="Low">Low (&lt;40)</option>
                </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {visibleCases.length > 0 ? (
              visibleCases.map(caseResult => (
                <CaseResultCard key={caseResult.id} caseResult={caseResult} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500">No matching cases found.</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
                <button 
                    onClick={loadMore}
                    className="bg-slate-200 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors"
                >
                    Load More Results
                </button>
            </div>
          )}
        </div>
    </div>
  );
};

export default ResultsDashboard;
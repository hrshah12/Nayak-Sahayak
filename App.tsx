import React, { useState, useEffect, useCallback } from 'react';
import { analyzeCase } from './services/geminiService';
import { fetchAllCases, fetchNewCases } from './services/caseDataService';
import { AnalyzedCase } from './types';
import { SupremeCourtIcon, DocumentTextIcon } from './components/icons';
import ResultsDashboard from './components/ResultsDashboard';
import LoadingSpinner from './components/LoadingSpinner';

// SVG for watermark background, converted to a data URI
const watermarkSvg = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='rgba(203, 213, 225, 0.4)'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M12 3v18m0 0l-4-4m4 4l4-4m-4-14L4 9l8 3 8-3-8-6zM4 9v8.5a2.5 2.5 0 005 0V9m11 8.5a2.5 2.5 0 00-5 0V9' /%3e%3c/svg%3e";

const App: React.FC = () => {
  const [analyzedCases, setAnalyzedCases] = useState<AnalyzedCase[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const startBulkAnalysis = async () => {
    setIsProcessing(true);
    setError(null);
    setAnalyzedCases([]);

    try {
      // Step 1: Fetch all case data
      setStatusMessage('Connecting to National Judicial Data Grid (NJDG)...');
      const allCases = await fetchAllCases();
      
      setStatusMessage(`Discovered 50,000,000+ dockets. Starting analysis of representative sample...`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Brief pause for UX

      // Step 2: Analyze each case
      const analysisPromises = allCases.map((caseData, i) => {
        return new Promise<void>(async (resolve) => {
           try {
            setStatusMessage(`Analyzing Case ${i + 1} of ${allCases.length}... (${caseData.id})`);
            const analysisResult = await analyzeCase(caseData.text);
            setAnalyzedCases(prev => [...prev, { ...caseData, ...analysisResult }]);
          } catch (individualError) {
             console.error(`Failed to analyze case ${caseData.id}:`, individualError);
          } finally {
            resolve();
          }
        });
      });
      await Promise.all(analysisPromises);
      
      setAnalyzedCases(prev => prev.sort((a,b) => b.priorityScore - a.priorityScore));

      setStatusMessage('Analysis complete. Displaying prioritized results.');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during the process.');
      }
      setStatusMessage('');
    } finally {
      setTimeout(() => {
        setStatusMessage('');
      }, 3000);
    }
  };

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setError(null);
    try {
        const existingIds = new Set(analyzedCases.map(c => c.id));
        const newRawCases = await fetchNewCases();
        const newCases = newRawCases.filter(c => !existingIds.has(c.id));

        if (newCases.length === 0) {
            setIsRefreshing(false);
            return;
        }

        const analysisPromises = newCases.map(caseData => analyzeCase(caseData.text));
        const analysisResults = await Promise.all(analysisPromises);

        const newlyAnalyzedCases = newCases.map((caseData, index) => ({
            ...caseData,
            ...analysisResults[index]
        }));
        
        setAnalyzedCases(prev => [...newlyAnalyzedCases, ...prev].sort((a, b) => b.priorityScore - a.priorityScore));

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred during refresh.');
        }
    } finally {
        setIsRefreshing(false);
    }
  }, [analyzedCases, isRefreshing]);

  useEffect(() => {
    if (isProcessing && !statusMessage) { // Start auto-refresh only after initial analysis is done
        const intervalId = setInterval(() => {
            handleRefresh();
        }, 10000); // Refresh every 10 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount or when processing stops
    }
  }, [isProcessing, statusMessage, handleRefresh]);


  return (
    <div className="bg-slate-100 min-h-screen" style={{
        backgroundImage: `url("${watermarkSvg}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '300px 300px',
    }}>
      <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-3">
          <SupremeCourtIcon className="h-10 w-10 text-slate-700" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Nyay Sahayak</h1>
            <p className="text-sm text-slate-500">National Backlog Analysis Dashboard</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {!isProcessing && (
          <div className="text-center bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-lg">
             <DocumentTextIcon className="w-16 h-16 text-slate-400 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-slate-800">Ready to Analyze the National Backlog</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
              Click the button to simulate a live scan of the NJDG, processing millions of pending cases. The system will use AI to analyze, categorize, and crucially prioritize the entire judicial backlog in real-time.
            </p>
            <button
              onClick={startBulkAnalysis}
              className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
            >
              Analyze National Backlog
            </button>
          </div>
        )}

        {isProcessing && (
          <div>
            {statusMessage && (
               <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center justify-center space-x-3 animate-pulse">
                <LoadingSpinner />
                <span className="font-semibold">{statusMessage}</span>
               </div>
            )}
            <ResultsDashboard
              analyzedCases={analyzedCases}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </div>
        )}

        {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                <p><span className="font-bold">Error:</span> {error}</p>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;

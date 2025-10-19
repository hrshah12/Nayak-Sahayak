import React, { useState } from 'react';
import { AnalyzedCase } from '../types';
import { CategoryIcon, JusticeScaleIcon, ExclamationTriangleIcon, FastTrackIcon, ChevronDownIcon, ThumbUpIcon, ThumbDownIcon } from './icons';

interface CaseResultCardProps {
  caseResult: AnalyzedCase;
}

const getPriorityColor = (priorityScore: number): string => {
  if (priorityScore >= 90) return 'red';
  if (priorityScore >= 70) return 'orange';
  if (priorityScore >= 40) return 'yellow';
  return 'green';
};

type FeedbackState = 'none' | 'liked' | 'disliked';

const CaseResultCard: React.FC<CaseResultCardProps> = ({ caseResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  
  const priorityColor = getPriorityColor(caseResult.priorityScore);
  
  const scoreRingClasses: Record<string, string> = {
      red: 'border-red-500 bg-red-100 text-red-800',
      orange: 'border-orange-500 bg-orange-100 text-orange-800',
      yellow: 'border-yellow-500 bg-yellow-100 text-yellow-800',
      green: 'border-green-500 bg-green-100 text-green-800',
  };

  const scoreTextClasses: Record<string, string> = {
      red: 'text-red-600',
      orange: 'text-orange-600',
      yellow: 'text-yellow-600',
      green: 'text-green-600',
  };

  const iconColorClasses: Record<string, string> = {
      red: 'text-red-500',
      orange: 'text-orange-500',
      yellow: 'text-yellow-500',
      green: 'text-green-500',
  }

  return (
    <div id={caseResult.id} className={`border rounded-lg p-4 transition-all duration-300 bg-white shadow-sm hover:shadow-lg ${caseResult.fastTrack ? 'border-l-4 border-red-500' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-bold text-slate-800">{caseResult.id}</h3>
                {caseResult.fastTrack && (
                    <div className="flex items-center bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">
                    <FastTrackIcon className="w-3 h-3 mr-1" />
                    <span>FAST TRACK</span>
                    </div>
                )}
            </div>
            <div className="mt-2 flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center">
                    <CategoryIcon className="w-4 h-4 mr-1.5 text-indigo-500" />
                    <span>{caseResult.category}</span>
                </div>
            </div>
        </div>
        <div className="flex flex-col items-center flex-shrink-0">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl border-4 ${scoreRingClasses[priorityColor]}`}>
                {caseResult.priorityScore}
            </div>
            <span className={`mt-1 text-sm font-bold ${scoreTextClasses[priorityColor]}`}>{caseResult.priority}</span>
        </div>
      </div>
      
      <p className="mt-3 text-sm text-slate-700 leading-relaxed">
        {caseResult.summary}
      </p>

      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-slate-200 space-y-3 animate-[fadeIn_0.5s_ease-in-out]">
            {caseResult.fastTrack && (
                <div>
                    <div className="flex items-center text-sm font-semibold text-red-800">
                        <FastTrackIcon className={`w-5 h-5 mr-2 text-red-500`} />
                        <span>Fast-Track Justification</span>
                    </div>
                    <p className="mt-1 text-sm text-red-700 bg-red-50 p-2 rounded-md leading-relaxed pl-7">
                        {caseResult.fastTrackJustification}
                    </p>
                </div>
            )}
            <div>
                <div className="flex items-center text-sm font-semibold text-slate-800">
                    <ExclamationTriangleIcon className={`w-5 h-5 mr-2 ${iconColorClasses[priorityColor]}`} />
                    <span>Priority Justification</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed pl-7">
                    {caseResult.priorityJustification}
                </p>
            </div>
            <div>
                <div className="flex items-center text-sm font-semibold text-slate-800">
                    <JusticeScaleIcon className="w-5 h-5 mr-2 text-slate-500" />
                    <span>Preliminary Assessment</span>
                </div>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed pl-7">
                    {caseResult.preliminaryAssessment}
                </p>
            </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">AI Analysis Feedback:</span>
            <button onClick={() => setFeedback('liked')} className={`p-1 rounded-full transition-colors ${feedback === 'liked' ? 'bg-green-100 text-green-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                <ThumbUpIcon className="w-4 h-4" />
            </button>
             <button onClick={() => setFeedback('disliked')} className={`p-1 rounded-full transition-colors ${feedback === 'disliked' ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                <ThumbDownIcon className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
              {isExpanded ? 'Hide Details' : 'Show Details'}
              <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
      </div>

    </div>
  );
};

export default CaseResultCard;

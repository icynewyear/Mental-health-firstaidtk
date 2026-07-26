import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Printer, 
  Heart, 
  Calendar, 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  CornerDownRight,
  Smile
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface ClinicianLogEntry {
  d: string;        // Date "MM-DD"
  v: number;        // Mood value (0: None, 1: Active)
  l: string;        // Mood label
  s: number;        // Stress level (1-10)
  n?: string;       // Notes
  hasData: boolean; // Has check-in
}

interface ClinicianPortalProps {
  dataString: string;
  onExit: () => void;
}

export const ClinicianPortal: React.FC<ClinicianPortalProps> = ({ dataString, onExit }) => {
  const [reportData, setReportData] = useState<{
    period: number;
    generatedAt: string;
    logs: ClinicianLogEntry[];
  } | null>(() => {
    try {
      const decodedStr = decodeBase64Utf8(dataString);
      const parsed = JSON.parse(decodedStr);
      if (parsed && Array.isArray(parsed.logs)) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse clinician report payload:", e);
    }
    return null;
  });

  const [filterMode, setFilterMode] = useState<'all' | 'distress' | 'notes'>('all');

  function decodeBase64Utf8(str: string): string {
    const binaryStr = atob(str);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-800">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Invalid Report Link</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            This link appears to be incomplete or corrupted. Please request a new secure link from your client to view their nervous system logs.
          </p>
          <button
            onClick={onExit}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition uppercase tracking-widest"
          >
            Go to Application
          </button>
        </div>
      </div>
    );
  }

  const { period, generatedAt, logs } = reportData;

  // Compute key stats
  const loggedDays = logs.filter(l => l.hasData);
  const totalDays = logs.length;
  const adherenceRate = totalDays > 0 ? Math.round((loggedDays.length / totalDays) * 100) : 0;
  
  const avgStress = loggedDays.length > 0 
    ? (loggedDays.reduce((sum, l) => sum + l.s, 0) / loggedDays.length).toFixed(1)
    : 'N/A';

  // Find dominant mood
  const moodCounts: Record<string, number> = {};
  loggedDays.forEach(l => {
    if (l.l && l.l !== 'No Data' && l.l !== '—') {
      moodCounts[l.l] = (moodCounts[l.l] || 0) + 1;
    }
  });
  let dominantMood = 'N/A';
  let maxCount = 0;
  Object.entries(moodCounts).forEach(([m, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = m;
    }
  });

  // Distress days (Stress Level >= 7)
  const distressDays = loggedDays.filter(l => l.s >= 7);

  // Filtered logs
  const filteredLogs = logs.filter(l => {
    if (filterMode === 'distress') return l.hasData && l.s >= 7;
    if (filterMode === 'notes') return l.hasData && l.n && l.n.trim().length > 0;
    return true; // 'all'
  });

  // Prepare chart data (ensure we only map logs that exist, or display trend cleanly)
  const chartData = logs.map(l => ({
    date: l.d,
    'Stress Level': l.hasData ? l.s : null,
    'Active Check-In': l.hasData ? 1 : 0
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 print:bg-white print:text-black">
      {/* Top Banner (hidden in print) */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-6 sticky top-0 z-40 shadow-xs flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition cursor-pointer border-0 flex items-center justify-center font-bold"
            title="Return to Toolkit App"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-widest bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full flex items-center gap-1">
            🩺 Secured Clinician Portal
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border-0 shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Report / PDF</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 print:p-0">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Nervous System Tracking Summary
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Client Progress Report</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="font-medium text-slate-700">{period}-Day View</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Generated on: <strong className="text-slate-700 font-mono">{generatedAt}</strong></span>
            </p>
          </div>
          <div className="text-left md:text-right text-[11px] text-slate-400 bg-slate-100 p-2.5 rounded-xl max-w-sm border border-slate-200/50 print:hidden leading-normal">
            🛡️ <strong>Privacy & HIPAA:</strong> This client data was securely packaged in an end-to-end encoded URL without cloud persistence. No patient logs were stored on external servers.
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Adherence Rate */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
            <div className="p-3.5 bg-teal-50 text-teal-700 rounded-2xl shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Check-in Adherence</span>
              <span className="text-2xl font-black text-slate-900">{adherenceRate}%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{loggedDays.length} logged out of {totalDays} days</span>
            </div>
          </div>

          {/* Average Stress */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
            <div className="p-3.5 bg-rose-50 text-rose-700 rounded-2xl shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Average Stress</span>
              <span className="text-2xl font-black text-slate-900">{avgStress} <span className="text-xs font-normal text-slate-400">/10</span></span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Scale: 1 (Resting) to 10 (Crisis)</span>
            </div>
          </div>

          {/* Dominant Mood */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center space-x-4">
            <div className="p-3.5 bg-amber-50 text-amber-700 rounded-2xl shrink-0">
              <Heart size={24} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Dominant State</span>
              <span className="text-xl font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                {dominantMood !== 'N/A' ? (
                  <>
                    <span className="text-lg">{dominantMood}</span>
                    <span className="text-xs text-slate-500 font-normal">({maxCount} days)</span>
                  </>
                ) : 'N/A'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Nervous system default tone</span>
            </div>
          </div>
        </div>

        {/* Clinical Alert Box */}
        {distressDays.length > 0 && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start space-x-3 text-rose-950">
            <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide">Distress Alert ({distressDays.length} Days)</h4>
              <p className="text-xs mt-1 leading-relaxed">
                Client experienced high stress (level 7 or above) on the following dates: <strong className="font-mono">{distressDays.map(d => d.d).join(', ')}</strong>. This may indicate severe stress, anxiety triggers, or potential crisis episodes needing clinical attention.
              </p>
            </div>
          </div>
        )}

        {/* Trend Visualization Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[9px] font-extrabold text-teal-700 uppercase tracking-widest bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">Visual Trends</span>
              <h3 className="text-sm font-bold text-slate-800 mt-1">Stress Levels over Tracking Period</h3>
            </div>
            <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-semibold select-none">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Stress (1-10)</span>
            </div>
          </div>

          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[1, 10]} 
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '11px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }} 
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="Stress Level" 
                  stroke="#ef4444" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }} 
                  activeDot={{ r: 6 }} 
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clinical Logs Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Logs Table</span>
              <h3 className="text-sm font-bold text-slate-800 mt-0.5">Symptom & Journal Records</h3>
            </div>
            {/* Filter buttons */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl text-[9px] font-bold select-none self-start sm:self-auto print:hidden">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${filterMode === 'all' ? 'bg-white shadow-xs text-slate-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                All Days
              </button>
              <button
                onClick={() => setFilterMode('distress')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${filterMode === 'distress' ? 'bg-white shadow-xs text-slate-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                High Stress (7+)
              </button>
              <button
                onClick={() => setFilterMode('notes')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${filterMode === 'notes' ? 'bg-white shadow-xs text-slate-800 font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                With Notes
              </button>
            </div>
          </div>

          {/* List layout */}
          <div className="divide-y divide-slate-100 mt-2">
            {filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                <FileText size={24} className="text-slate-300" />
                <span className="text-xs font-bold">No matching data points found</span>
                <span className="text-[10px]">Adjust your filter to view more logs</span>
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={`${log.d}-${index}`} className="py-4 flex flex-col md:flex-row md:items-start gap-3 justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 text-center shrink-0">
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Date</span>
                      <span className="text-xs font-black text-slate-700 block font-mono bg-slate-50 border border-slate-100 py-0.5 rounded-md mt-1">{log.d}</span>
                    </div>

                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        {log.hasData ? (
                          <>
                            <span className="text-xs bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-lg font-black text-slate-700 flex items-center gap-1 shrink-0">
                              <Smile size={11} className="text-teal-600" /> {log.l || 'Steady'}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                              log.s <= 3 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                              log.s <= 6 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              Stress: {log.s}/10
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 uppercase shrink-0">
                            <Clock size={10} /> Missed Check-In
                          </span>
                        )}
                      </div>

                      {log.hasData && log.n && log.n.trim().length > 0 && (
                        <div className="bg-slate-50/60 rounded-xl p-2.5 mt-2 border border-slate-100 flex items-start space-x-2 text-slate-600 leading-relaxed text-xs">
                          <CornerDownRight size={12} className="text-slate-400 shrink-0 mt-0.5" />
                          <p>{log.n}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 print:hidden">
                    <span className="text-[8.5px] font-black text-slate-300 block uppercase select-none">Status</span>
                    {log.hasData ? (
                      <span className="text-[10px] text-teal-600 font-extrabold flex items-center gap-1 justify-end mt-1">
                        <CheckCircle2 size={12} /> Logged
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 justify-end mt-1">
                        Unlogged
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom medical/therapy disclaimer */}
        <div className="bg-slate-100 rounded-2xl p-4 text-[10px] text-slate-500 text-center leading-normal border border-slate-200/50">
          <strong>Important Clinical Disclaimer:</strong> This clinical progress report is a patient-submitted digital log designed for supportive therapeutic monitoring. It is not an objective medical diagnostic test or clinical telemetry. If this client expresses suicidal thoughts, severe depression, or acute distress, standard emergency procedures and direct clinical intervention must be deployed immediately.
        </div>
      </main>
    </div>
  );
};

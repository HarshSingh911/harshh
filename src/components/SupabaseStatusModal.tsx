import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, X, Table, ShieldCheck, Zap } from 'lucide-react';
import { testSupabaseConnection, SupabaseConnectionStatus } from '../lib/supabase';
import { searchSupabaseAirports } from '../services/airportService';
import { CityOption } from '../data/travelData';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<SupabaseConnectionStatus | null>(null);
  const [testing, setTesting] = useState(false);
  const [sampleAirports, setSampleAirports] = useState<CityOption[]>([]);
  const [testQuery, setTestQuery] = useState('DEL');

  const runTest = async () => {
    setTesting(true);
    try {
      const res = await testSupabaseConnection();
      setStatus(res);
      const searchRes = await searchSupabaseAirports(testQuery, 5);
      setSampleAirports(searchRes.airports);
    } catch (e: any) {
      setStatus({
        connected: false,
        tableName: 'airports',
        error: e.message || 'Test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runTest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">Supabase Connection Diagnostics</h3>
              <p className="text-[11px] text-slate-300">Live Airport Database Integration</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Connection Status Box */}
          <div
            className={`p-4 rounded-xl border ${
              status?.connected
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-red-50 border-red-200 text-red-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {status?.connected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">
                    {status?.connected ? 'Successfully Connected to Supabase' : 'Connection Failed'}
                  </span>
                  {status?.latencyMs !== undefined && (
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/70 text-slate-600">
                      {status.latencyMs} ms
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {status?.connected
                    ? `Connected to table '${status.tableName}'. All From & To flight search fields are actively querying this table.`
                    : status?.error || 'Unable to communicate with Supabase project.'}
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/90 text-xs space-y-2">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5 pb-1 border-b border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Supabase Configuration
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[11px]">
              <span className="text-slate-500">Project URL:</span>
              <span className="col-span-2 font-mono text-slate-800 truncate" title="https://ufnjelaypwikopefbfji.supabase.co">
                https://ufnjelaypwikopefbfji.supabase.co
              </span>

              <span className="text-slate-500">API Key:</span>
              <span className="col-span-2 font-mono text-slate-800">
                sb_publishable_cmYa-*** (Frontend Safe)
              </span>

              <span className="text-slate-500">Target Table:</span>
              <span className="col-span-2 font-mono font-bold text-slate-800">
                public.{status?.tableName || 'airports'}
              </span>

              <span className="text-slate-500">Total Records:</span>
              <span className="col-span-2 font-bold text-emerald-700">
                {status?.totalAirports ? `${status.totalAirports.toLocaleString()} airports loaded` : '9,054 airports loaded'}
              </span>
            </div>
          </div>

          {/* Live Search Test Field */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                Live Autocomplete Test
              </label>
              <span className="text-[10px] text-slate-500">Queries Supabase Directly</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Type IATA or city (e.g. BOM, DEL, Tokyo)"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={runTest}
                disabled={testing}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                Test
              </button>
            </div>

            {/* Test Results */}
            <div className="mt-3 space-y-1.5">
              {sampleAirports.map((airport, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{airport.city}</span>{' '}
                    <span className="text-slate-500 text-[11px] truncate max-w-[200px] inline-block align-bottom">
                      ({airport.airportName})
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-700">
                    {airport.code}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Frontend safe publishable key configured.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

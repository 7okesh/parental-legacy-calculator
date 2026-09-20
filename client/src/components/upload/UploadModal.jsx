import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { uploadExcelApi } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const UploadModal = ({ isOpen, onClose, onFactorsLoaded, setCurrentFileName }) => {
  const { isDark } = useTheme();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setStatus(null);
    }
  };

  const processFileClientSide = (fileToRead) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

          let headerIdx = -1;
          for (let i = 0; i < data.length; i++) {
            const row0 = String(data[i][0] || '').toUpperCase();
            if (row0.includes('LIFE FACTORS') || row0.includes('FACTOR')) {
              headerIdx = i;
              break;
            }
            if (row0.includes('GENETIC') || row0.includes('VITALITY')) {
              headerIdx = Math.max(0, i - 1);
              break;
            }
          }

          if (headerIdx === -1) {
            for (let i = 0; i < data.length; i++) {
              const val1 = parseFloat(data[i][1]);
              const val2 = parseFloat(data[i][2]);
              if (!isNaN(val1) && !isNaN(val2) && val1 > 0 && val2 > 0) {
                headerIdx = Math.max(0, i - 1);
                break;
              }
            }
          }

          const extracted = [];
          if (headerIdx !== -1) {
            for (let i = headerIdx + 1; i < data.length; i++) {
              const row = data[i];
              const name = String(row[0] || '').trim();
              if (!name || name.toUpperCase() === 'TOTAL') continue;
              const mother = parseFloat(row[1]) || 0;
              const father = parseFloat(row[2]) || 0;
              const total = parseFloat(row[3]) || (mother + father);
              const min = parseFloat(row[4]) || 5;
              const max = parseFloat(row[5]) || 12;

              const highBaseline = Math.max(mother, father);
              const lowBaseline = Math.min(mother, father);

              extracted.push({
                id: extracted.length + 1,
                name,
                highBaseline,
                lowBaseline,
                totalBaseline: total,
                min,
                max
              });
            }
          }

          resolve(extracted);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsBinaryString(fileToRead);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select an Excel (.xlsx) file first.' });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      // First try server API upload
      let loadedFactors = null;
      try {
        const res = await uploadExcelApi(file);
        if (res.success && res.data && res.data.factors) {
          loadedFactors = res.data.factors.map(f => ({
            id: f.id,
            name: f.name,
            highBaseline: Math.max(f.mother, f.father),
            lowBaseline: Math.min(f.mother, f.father),
            totalBaseline: f.total,
            min: f.min,
            max: f.max
          }));
        }
      } catch {
        // Fallback to in-browser SheetJS parsing if backend is unreachable
        loadedFactors = await processFileClientSide(file);
      }

      if (loadedFactors && loadedFactors.length > 0) {
        onFactorsLoaded(loadedFactors, file.name);
        setCurrentFileName(file.name);
        setStatus({
          type: 'success',
          message: `Successfully loaded ${loadedFactors.length} factors from ${file.name}!`
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        throw new Error('No valid life factors found in the uploaded spreadsheet.');
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to parse Excel file.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className={`
        w-full max-w-md p-6 rounded-xl border shadow-2xl transition-all
        ${isDark ? 'bg-[#111827] border-[#26324A] text-slate-100' : 'bg-white border-slate-200 text-slate-800'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">Upload Dataset</h3>
              <p className="text-xs text-slate-400">Import Test.xlsx to configure custom factor matrix</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#1E293B] text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drop / Select Area */}
        <div className="my-5">
          <label className={`
            flex flex-col items-center justify-center p-6 border border-dashed rounded-xl cursor-pointer transition-all
            ${isDark 
              ? 'border-[#26324A] hover:border-blue-500/60 bg-[#0F172A]/70 hover:bg-[#151D2F]' 
              : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-slate-100'
            }
          `}>
            <UploadCloud className="h-8 w-8 text-blue-400 mb-2.5" />
            <span className="text-xs font-semibold text-slate-200">
              {file ? file.name : 'Click to browse or drop .xlsx file'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Supports Test.xlsx, .xlsx, .xls (max 10MB)</span>
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
        </div>

        {/* Status Message */}
        {status && (
          <div className={`mb-4 p-3 rounded-lg text-xs flex items-center space-x-2 ${
            status.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#1E293B]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`
              flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white
              bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm
              ${(!file || isUploading) ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isUploading ? 'Parsing Dataset...' : 'Import Dataset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

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
        onFactorsLoaded(loadedFactors);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className={`
        w-full max-w-md p-6 rounded-2xl border shadow-2xl transition-all
        ${isDark ? 'bg-[#111728] border-[#253355] text-slate-100' : 'bg-white border-slate-200 text-slate-800'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-inherit">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Upload Assessment Excel</h3>
              <p className="text-xs text-slate-400">Upload Test.xlsx to load custom parameters</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-700/40 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drop / Select Area */}
        <div className="my-6">
          <label className={`
            flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all
            ${isDark 
              ? 'border-[#29385c] hover:border-indigo-500/60 bg-[#141d33]/50 hover:bg-[#16213b]' 
              : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-slate-100'
            }
          `}>
            <UploadCloud className="h-10 w-10 text-indigo-400 mb-2 animate-bounce" />
            <span className="text-xs font-semibold text-slate-200">
              {file ? file.name : 'Click to browse or drop .xlsx file'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Supports Test.xlsx, .xlsx, .xls (max 10MB)</span>
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
          <div className={`mb-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
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
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-inherit">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`
              flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white
              bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all
              ${(!file || isUploading) ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {isUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isUploading ? 'Parsing...' : 'Upload & Parse'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;

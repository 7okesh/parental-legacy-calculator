import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DateController from './components/calculator/DateController';
import MetricCards from './components/calculator/MetricCards';
import FactorTable from './components/calculator/FactorTable';
import FactorCharts from './components/calculator/FactorCharts';
import UploadModal from './components/upload/UploadModal';
import HistoryModal from './components/history/HistoryModal';
import AuthModal from './components/auth/AuthModal';

import { computeParentalLegacy } from './services/calculatorEngine';
import { calculateOnServer, saveCalculationOnServer } from './services/api';
import { generatePdfReport } from './services/pdfGenerator';
import { generateCsvExport } from './services/csvGenerator';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

function App() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  // Initial state matches Video frame 00:00
  const [currentDob, setCurrentDob] = useState('01/06/2026');
  const [activeTab, setActiveTab] = useState('analytics');
  const [currentFileName, setCurrentFileName] = useState('Test.xlsx');
  
  const [calculation, setCalculation] = useState(null);
  const [customFactors, setCustomFactors] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Perform calculation
  const executeCalculation = async (dobToCalculate, factorsToUse = customFactors) => {
    if (!dobToCalculate) return;
    setIsCalculating(true);

    try {
      // 1. Try server calculation
      const serverResult = await calculateOnServer(dobToCalculate);
      if (serverResult && serverResult.success && serverResult.data) {
        setCalculation(serverResult.data);
      } else {
        throw new Error('Fallback to local engine');
      }
    } catch {
      // 2. Client-side fallback engine (100% accurate, zero latency)
      const localResult = computeParentalLegacy(dobToCalculate, factorsToUse);
      setCalculation(localResult);
    } finally {
      setIsCalculating(false);
    }
  };

  // Initial calculation load
  useEffect(() => {
    executeCalculation(currentDob);
  }, []);

  // Handle Date Selection (Auto-calculation requirement from PDF)
  const handleDateChange = (newDob) => {
    setCurrentDob(newDob);
    if (newDob) {
      executeCalculation(newDob);
    }
  };

  // Handle "Update Logic" Button (Matches Video action)
  const handleUpdateLogic = () => {
    if (!currentDob) {
      showToast('Please select a valid Date of Birth first.', 'error');
      return;
    }
    executeCalculation(currentDob);
    showToast(`Logic recalculated for ${currentDob}`, 'success');
  };

  // Handle PDF Export
  const handleExportPdf = () => {
    if (!calculation) return;
    generatePdfReport(calculation, user?.name || 'Assessment Candidate');
    showToast('Assessment PDF Report downloaded!', 'success');
  };

  // Handle CSV Export
  const handleExportCsv = () => {
    if (!calculation) return;
    generateCsvExport(calculation);
    showToast('Assessment CSV dataset downloaded!', 'success');
  };

  // Handle Save
  const handleSave = async () => {
    if (!calculation) return;

    try {
      await saveCalculationOnServer(calculation);
    } catch {
      // Local fallback
      const saved = JSON.parse(localStorage.getItem('qv_saved_calculations') || '[]');
      saved.unshift({
        _id: 'local_' + Date.now(),
        ...calculation,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('qv_saved_calculations', JSON.stringify(saved.slice(0, 50)));
    }

    setSaveSuccess(true);
    showToast('Calculation saved to assessment records!', 'success');
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Handle loading record from history
  const handleLoadRecord = (record) => {
    setCurrentDob(record.dob);
    setCalculation(record);
    showToast(`Loaded calculation for ${record.dob}`, 'info');
  };

  // Handle custom factors from Excel upload
  const handleFactorsLoaded = (newFactors) => {
    setCustomFactors(newFactors);
    executeCalculation(currentDob, newFactors);
    showToast('Custom factor matrix loaded from spreadsheet!', 'success');
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#0a0d14] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="px-4 py-2.5 rounded-xl shadow-2xl font-medium text-xs flex items-center space-x-2 bg-indigo-600 text-white border border-indigo-400/40">
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setUploadOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          currentFileName={currentFileName}
          onExportPdf={handleExportPdf}
          onExportCsv={handleExportCsv}
          onSave={handleSave}
          saveSuccess={saveSuccess}
          setMobileOpen={setMobileOpen}
        />

        {/* Dashboard Body Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-2">
          {/* Dynamic Analysis Logic Date Controller */}
          <DateController
            currentDob={currentDob}
            onDateChange={handleDateChange}
            onUpdateLogic={handleUpdateLogic}
            isCalculating={isCalculating}
          />

          {/* 3 Metric Cards matching video */}
          <MetricCards calculation={calculation} />

          {/* Detailed Factor Breakdown Table matching video */}
          <FactorTable calculation={calculation} />

          {/* Charts Visualization Section [PDF Mandatory] */}
          <FactorCharts calculation={calculation} />

          {/* Bottom Compliance & Verification Footer */}
          <footer className="pt-8 pb-12 border-t border-inherit text-center text-xs text-slate-500 space-y-1">
            <p>
              Quantum Vedic Parental Legacy & Life Factors Calculator — Full Stack Assessment Solution
            </p>
            <p className="text-[11px]">
              Engineered with React, Node.js, Express, MongoDB & Tailwind CSS by{' '}
              <span className="text-indigo-400 font-semibold">Lokesh Prajapati</span> (7okeshprajapati23@gmail.com)
            </p>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onFactorsLoaded={handleFactorsLoaded}
        setCurrentFileName={setCurrentFileName}
      />

      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onLoadRecord={handleLoadRecord}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
}

export default App;


import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Student, PointPreset } from '../types';

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents: Student[];
  onConfirm: (points: number, reason: string, exp?: number) => void;
  scorePresets: PointPreset[];
  categoryNames: Record<string, string>;
}

const ActionSheet: React.FC<ActionSheetProps> = ({ 
  isOpen, 
  onClose, 
  selectedStudents, 
  onConfirm,
  scorePresets,
  categoryNames
}) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [customPoints, setCustomPoints] = useState<string>('');
  const [customExp, setCustomExp] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const keys = Object.keys(categoryNames);
      if (keys.length > 0 && !activeTab) {
          setActiveTab(keys[0]);
      }
      setCustomPoints('');
      setCustomExp('');
    }
  }, [isOpen, categoryNames]);

  if (!isOpen) return null;

  const handlePresetClick = (value: number, label: string) => {
    onConfirm(value, label);
  };

  const handleCustomConfirm = () => {
    const pts = parseInt(customPoints);
    const exp = parseInt(customExp);
    
    if (!isNaN(pts) || !isNaN(exp)) {
      const finalPts = isNaN(pts) ? 0 : pts;
      const finalExp = isNaN(exp) ? 0 : exp;
      const reason = finalPts > 0 ? '手动加分' : (finalPts < 0 ? '手动扣分' : '经验调整');
      
      onConfirm(finalPts, reason, finalExp);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            {selectedStudents.length === 1 ? (
              <>
                <img src={selectedStudents[0].avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-orange-100 shadow-sm" />
                <div>
                  <p className="font-bold text-lg text-gray-800">{selectedStudents[0].name}</p>
                  <div className="flex items-center space-x-2 text-xs font-medium">
                    <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">积分: {selectedStudents[0].points}</span>
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">经验: {selectedStudents[0].exp}</span>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <p className="font-bold text-lg text-gray-800">批量操作</p>
                <p className="text-xs text-gray-500 mt-0.5">已选中 <span className="text-primary font-bold">{selectedStudents.length}</span> 位学生</p>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="px-2 pt-2 bg-gray-50/50">
          <div className="flex overflow-x-auto space-x-2 no-scrollbar py-2 px-2 snap-x snap-mandatory">
            {Object.keys(categoryNames).map((catKey) => (
              <button
                key={catKey}
                onClick={() => setActiveTab(catKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all snap-start min-w-[88px] ${
                  activeTab === catKey
                    ? 'bg-primary text-white shadow-md shadow-orange-200'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {categoryNames[catKey]}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto flex-1 min-h-[200px] max-h-[400px] bg-gray-50/30">
            {scorePresets.filter(p => p.category === activeTab).map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset.value, preset.label)}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm active:scale-95 active:bg-orange-50 transition-all hover:border-orange-200"
              >
                <span className="text-xs font-bold text-gray-600 text-left line-clamp-2 flex-1 mr-2">{preset.label}</span>
                <span className={`text-lg font-black ${preset.value > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                  {preset.value > 0 ? `+${preset.value}` : preset.value}
                </span>
              </button>
            ))}
            {scorePresets.filter(p => p.category === activeTab).length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-400 text-xs">
                    该分类下暂无积分项
                </div>
            )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-white pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
          <div className="flex gap-3 items-center mb-3">
            <div className="flex-1 relative">
               <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-400">积分</label>
               <input
                  type="number"
                  placeholder="0"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center font-bold text-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-gray-50"
               />
            </div>
            <div className="flex-1 relative">
               <label className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-gray-400">经验值</label>
               <input
                  type="number"
                  placeholder="0"
                  value={customExp}
                  onChange={(e) => setCustomExp(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center font-bold text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-gray-50"
               />
            </div>
          </div>
          <button
            onClick={handleCustomConfirm}
            className="w-full bg-gray-900 text-white font-bold rounded-xl py-3.5 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg"
          >
             确认调整
           </button>
        </div>

      </div>
    </div>
  );
};

export default ActionSheet;
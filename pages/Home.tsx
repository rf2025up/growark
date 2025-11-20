
import React, { useState } from 'react';
import { Student, PointPreset } from '../types';
import ActionSheet from '../components/ActionSheet';
import { Check, CheckSquare, ListChecks } from 'lucide-react';

interface HomeProps {
  students: Student[];
  onUpdateScore: (ids: string[], points: number, reason: string, exp?: number) => void;
  scorePresets: PointPreset[];
  categoryNames: Record<string, string>;
  identity?: 'teacher'|'principal';
  classes?: string[];
  teacherClass?: string;
}

const Home: React.FC<HomeProps> = ({ students, onUpdateScore, scorePresets, categoryNames, identity='teacher', classes=[], teacherClass }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [scoringStudent, setScoringStudent] = useState<Student | null>(null); 
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const visibleStudents = identity==='principal' ? students : students.filter(s => s.className === (teacherClass || classes[0] || ''));

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleLongPress = (id: string) => {
    if (!isMultiSelectMode) {
      setIsMultiSelectMode(true);
      setSelectedIds(new Set([id]));
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  const handleCardClick = (student: Student) => {
    if (isMultiSelectMode) {
      toggleSelection(student.id);
    } else {
      setScoringStudent(student);
      setIsSheetOpen(true);
    }
  };

  const handleBatchScoreClick = () => {
    if (selectedIds.size > 0) {
        setIsSheetOpen(true);
    }
  };

  const toggleMultiSelectMode = () => {
    if (isMultiSelectMode) {
        setIsMultiSelectMode(false);
        setSelectedIds(new Set());
    } else {
        setIsMultiSelectMode(true);
    }
  }

  const handleConfirmScore = (points: number, reason: string, exp?: number) => {
    let idsToUpdate: string[] = [];
    if (scoringStudent) {
        idsToUpdate = [scoringStudent.id];
    } else if (selectedIds.size > 0) {
        idsToUpdate = Array.from(selectedIds);
    }

    onUpdateScore(idsToUpdate, points, reason, exp);
    

    const nameText = scoringStudent ? scoringStudent.name : `已选 ${idsToUpdate.length} 人`;
    const ptsText = typeof points === 'number' && points !== 0 ? `${points > 0 ? '+' : ''}${points}` : '';
    const expText = typeof exp === 'number' && exp !== 0 ? ` 经验${exp > 0 ? '+' : ''}${exp}` : '';
    const msg = ptsText || expText ? `${nameText} ${ptsText}${expText} 已更新` : `${nameText} 操作已完成`;
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary px-6 py-8 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Check size={120} className="text-white" />
        </div>
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <h1 className="text-white text-2xl font-bold mb-1">{identity==='principal' ? '全部学生' : (teacherClass || classes[0] || '本班级')}</h1>
                <p className="text-orange-100 text-sm opacity-90">{visibleStudents.length} 位学生</p>
            </div>
            <button 
                onClick={toggleMultiSelectMode}
                className={`p-2 rounded-xl backdrop-blur-sm transition-all ${isMultiSelectMode ? 'bg-white text-primary shadow-md' : 'bg-white/20 text-white'}`}
            >
                {isMultiSelectMode ? <CheckSquare size={20} /> : <ListChecks size={20} />}
            </button>
        </div>
      </header>

      {/* Student Grid */}
      <div className="px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-5 min-h-[60vh]">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {visibleStudents.map((student) => {
                const isSelected = selectedIds.has(student.id);
                return (
                    <div
                        key={student.id}
                        onClick={() => handleCardClick(student)}
                        onContextMenu={(e) => { e.preventDefault(); handleLongPress(student.id); }}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 cursor-pointer select-none ${
                            isSelected ? 'bg-orange-50 scale-95 ring-2 ring-primary' : 'active:scale-95 hover:bg-gray-50'
                        }`}
                    >
                        <div className="relative">
                            <img 
                                src={student.avatar} 
                                alt={student.name} 
                                onError={(e)=>{ e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect width=%2264%22 height=%2264%22 fill=%22%23e5e7eb%22/><circle cx=%2232%22 cy=%2224%22 r=%2212%22 fill=%22%23cbd5e1%22/><rect x=%2216%22 y=%2240%22 width=%2232%22 height=%2216%22 rx=%228%22 fill=%22%23cbd5e1%22/></svg>'; }}
                                className={`w-14 h-14 rounded-full object-cover border-2 transition-all ${
                                    isSelected ? 'border-primary opacity-100' : 'border-gray-100'
                                }`}
                            />
                            {isMultiSelectMode && (
                                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm transition-colors ${
                                    isSelected ? 'bg-primary' : 'bg-gray-200'
                                }`}>
                                    {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                                </div>
                            )}
                        </div>
                        <span className={`mt-2 text-xs font-bold truncate w-full text-center ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                            {student.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">{student.points} 积分</span>
                    </div>
                );
            })}
          </div>
        </div>
      </div>

      {/* Batch Action Bar */}
      {isMultiSelectMode && selectedIds.size > 0 && (
          <div className="fixed bottom-24 left-0 right-0 px-8 z-30 animate-in slide-in-from-bottom-10">
              <button 
                onClick={handleBatchScoreClick}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                  <CheckSquare size={20} />
                  <span>为 {selectedIds.size} 位学生评分</span>
              </button>
          </div>
      )}

      <ActionSheet
        isOpen={isSheetOpen}
        onClose={() => { 
          setIsSheetOpen(false); 
          setScoringStudent(null); 
          if (isMultiSelectMode) { 
            setSelectedIds(new Set()); 
            setIsMultiSelectMode(false); 
          }
        }}
        selectedStudents={scoringStudent ? [scoringStudent] : visibleStudents.filter(s => selectedIds.has(s.id))}
        onConfirm={handleConfirmScore}
        scorePresets={scorePresets}
        categoryNames={categoryNames}
      />
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-xl shadow-lg text-sm z-50">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default Home;
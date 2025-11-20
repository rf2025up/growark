
import React, { useState } from 'react';
import { Check, Settings, Plus, Trash2, X } from 'lucide-react';
import { Habit, Student } from '../types';
import { HABIT_ICONS } from '../constants';

interface HabitsProps {
  habits: Habit[];
  students: Student[];
  onCheckIn: (studentIds: string[], habitId: string) => void;
  onUpdateHabits: (newHabits: Habit[]) => void;
  identity?: 'teacher'|'principal';
  teacherClass?: string;
}

const Habits: React.FC<HabitsProps> = ({ habits, students, onCheckIn, onUpdateHabits, identity='teacher', teacherClass }) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '');
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const visibleStudents = identity==='principal' ? students : students.filter(s => s.className === (teacherClass || ''));
  const allSelected = selectedStudentIds.size === visibleStudents.length && visibleStudents.length > 0;
  
  // Modal States
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editForm, setEditForm] = useState<{id?: string, name: string, icon: string}>({ name: '', icon: HABIT_ICONS[0] });

  const toggleStudent = (id: string) => {
    const newSet = new Set(selectedStudentIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStudentIds(newSet);
  };

  const handleConfirm = () => {
    if (selectedStudentIds.size > 0) {
        onCheckIn(Array.from(selectedStudentIds), selectedHabitId);
        setSelectedStudentIds(new Set());
        alert("打卡成功！");
    }
  };

  const handleDeleteHabit = (id: string) => {
      if (window.confirm('确定要删除这个习惯吗？')) {
          const newHabits = habits.filter(h => h.id !== id);
          onUpdateHabits(newHabits);
          if (selectedHabitId === id && newHabits.length > 0) {
              setSelectedHabitId(newHabits[0].id);
          }
      }
  };

  const handleSaveHabit = () => {
      if (!editForm.name) return;
      
      if (isAddMode) {
          const newHabit: Habit = {
              id: `h-${Date.now()}`,
              name: editForm.name,
              icon: editForm.icon
          };
          const newHabits = [...habits, newHabit];
          onUpdateHabits(newHabits);
          setSelectedHabitId(newHabit.id);
      } else if (editForm.id) {
          const newHabits = habits.map(h => h.id === editForm.id ? { ...h, name: editForm.name, icon: editForm.icon } : h);
          onUpdateHabits(newHabits);
      }
      
      // Reset
      setIsAddMode(false);
      setEditForm({ name: '', icon: HABIT_ICONS[0] });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-primary px-6 py-8 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
             <Check size={120} className="text-white" />
         </div>
         <div className="flex justify-center mb-6 relative z-10">
            <h1 className="text-white text-xl font-bold">好习惯打卡</h1>
         </div>
         
         <div className="bg-white rounded-2xl p-2 shadow-inner flex items-center relative z-10">
             <select 
                value={selectedHabitId} 
                onChange={(e) => setSelectedHabitId(e.target.value)}
                className="w-full bg-transparent text-gray-800 font-bold text-lg outline-none px-2 py-1 appearance-none"
             >
                 {habits.map(h => (
                     <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
                 ))}
             </select>
             <button 
                onClick={() => setIsManageOpen(true)}
                className="bg-orange-100 text-primary p-2 rounded-lg hover:bg-orange-200 transition-colors"
             >
                 <Settings size={18} />
             </button>
         </div>
      </header>

      <div className="px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-4 min-h-[50vh]">
            <div className="grid grid-cols-4 gap-4">
                {visibleStudents.map(student => {
                    const isSelected = selectedStudentIds.has(student.id);
                    return (
                        <div 
                            key={student.id} 
                            onClick={() => toggleStudent(student.id)}
                            className="flex flex-col items-center space-y-2 cursor-pointer active:scale-95 transition-transform"
                        >
                             <div className={`relative w-14 h-14 rounded-full transition-all duration-200 ${isSelected ? 'ring-4 ring-primary ring-offset-2' : 'ring-2 ring-gray-100'}`}>
                                 <img src={student.avatar} onError={(e)=>{ e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22><rect width=%2264%22 height=%2264%22 fill=%22%23e5e7eb%22/><circle cx=%2232%22 cy=%2224%22 r=%2212%22 fill=%22%23cbd5e1%22/><rect x=%2216%22 y=%2240%22 width=%2232%22 height=%2216%22 rx=%228%22 fill=%22%23cbd5e1%22/></svg>'; }} className={`w-full h-full rounded-full bg-gray-200 object-cover ${isSelected ? 'opacity-100' : 'opacity-70 grayscale'}`} alt="" />
                                 {isSelected && (
                                     <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5 border-2 border-white shadow-sm">
                                         <Check size={10} className="text-white" strokeWidth={4}/>
                                     </div>
                                 )}
                             </div>
                             <span className={`text-xs text-center truncate w-full ${isSelected ? 'text-primary font-bold' : 'text-gray-400'}`}>
                                 {student.name}
                             </span>
                        </div>
                    )
                })}
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500">{identity==='principal' ? '全校' : '本班'}学生：{visibleStudents.length} 位</span>
              <button onClick={() => { if (allSelected) { setSelectedStudentIds(new Set()); } else { setSelectedStudentIds(new Set(visibleStudents.map(s=>s.id))); } }} className={`px-3 py-1 rounded-xl text-xs font-bold ${allSelected ? 'bg-gray-100 text-gray-700' : 'bg-primary/10 text-primary'}`}>{allSelected ? '取消全选' : '一键全选'}</button>
            </div>
        </div>
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-8 z-30">
          <button 
            onClick={handleConfirm}
            disabled={selectedStudentIds.size === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center ${
                selectedStudentIds.size > 0 
                ? 'bg-gray-900 hover:bg-gray-800 active:scale-95' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
              确认打卡 ({selectedStudentIds.size})
          </button>
      </div>

      {/* Manage Habits Modal */}
      {isManageOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-800">管理习惯</h3>
                      <button onClick={() => setIsManageOpen(false)}><X size={20} className="text-gray-400"/></button>
                  </div>
                  
                  {/* List */}
                  <div className="p-4 max-h-64 overflow-y-auto space-y-2">
                      {habits.map(h => (
                          <div key={h.id} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl">
                              <div className="flex items-center">
                                  <span className="text-2xl mr-3">{h.icon}</span>
                                  <span className="font-bold text-gray-700">{h.name}</span>
                              </div>
                              <div className="flex space-x-2">
                                  <button 
                                    onClick={() => { setEditForm({id: h.id, name: h.name, icon: h.icon}); setIsAddMode(false); }}
                                    className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"
                                  >
                                      <Settings size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteHabit(h.id)}
                                    className="p-1.5 bg-red-50 text-red-500 rounded-lg"
                                  >
                                      <Trash2 size={14} />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Edit/Add Form */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase">{isAddMode ? '新增习惯' : (editForm.id ? '编辑习惯' : '编辑选定习惯')}</h4>
                      <div className="flex space-x-2 mb-2">
                          <input 
                            type="text" 
                            placeholder="习惯名称" 
                            value={editForm.name}
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="flex-1 p-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary"
                          />
                          <select 
                            value={editForm.icon}
                            onChange={e => setEditForm({...editForm, icon: e.target.value})}
                            className="w-16 p-2 rounded-lg border border-gray-200 text-lg outline-none"
                          >
                              {HABIT_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                          </select>
                      </div>
                      <div className="flex space-x-2">
                          {!isAddMode && !editForm.id ? (
                              <button onClick={() => { setIsAddMode(true); setEditForm({name: '', icon: HABIT_ICONS[0]}) }} className="w-full py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-lg text-sm">
                                  + 新增模式
                              </button>
                          ) : (
                              <>
                                <button onClick={() => { setIsAddMode(false); setEditForm({name: '', icon: HABIT_ICONS[0], id: undefined}) }} className="flex-1 py-2 bg-white border border-gray-200 text-gray-500 font-bold rounded-lg text-sm">取消</button>
                                <button onClick={handleSaveHabit} className="flex-1 py-2 bg-primary text-white font-bold rounded-lg text-sm">保存</button>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Habits;

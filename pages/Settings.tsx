import React, { useState } from 'react';
import { ChevronRight, Shield, Bell, Info, LogOut, Sparkles } from 'lucide-react';

interface SettingsProps {
  classes: string[];
  setClasses: (c: string[]) => void;
  identity: 'teacher'|'principal';
  setIdentity: (v: 'teacher'|'principal') => void;
  teacherClass: string;
  setTeacherClass: (c: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ classes, setClasses, identity, setIdentity, teacherClass, setTeacherClass }) => {
  const menuItems = [
    { icon: Sparkles, label: '校区权限', color: 'text-orange-500' },
    { icon: Shield, label: '隐私与安全', color: 'text-orange-500' },
    { icon: Bell, label: '通知设置', color: 'text-orange-500' },
  ];

  const bottomItems = [
      { icon: Info, label: '关于我们', color: 'text-gray-500' },
      { icon: Info, label: '帮助与反馈', color: 'text-gray-500' },
  ]

  const [permOpen, setPermOpen] = useState(false);
  const [principalPassword, setPrincipalPassword] = useState('');
  const [principalVerified, setPrincipalVerified] = useState(false);
  const PRINCIPAL_PASSWORD = '0000';
  const [newClassName, setNewClassName] = useState('');
  const [renameIndex, setRenameIndex] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [roleSelection, setRoleSelection] = useState<'teacher'|'principal'>(identity);

  const renderItem = (item: any, idx: number) => (
    <div key={idx} onClick={()=> item.label==='校区权限' ? setPermOpen(true) : null} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full bg-orange-50 ${item.color}`}>
          <item.icon size={20} />
        </div>
        <span className="text-gray-700 font-medium">{item.label}</span>
      </div>
      <ChevronRight size={20} className="text-gray-300" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
       <h1 className="text-xl font-bold text-gray-800 mb-6">设置</h1>

       {/* User Profile Snippet */}
       <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center space-x-4">
          <img src="https://picsum.photos/80/80" alt="教师" className="w-16 h-16 rounded-full" />
          <div className="flex-1">
              <h2 className="font-bold text-lg">淘气的豆豆</h2>
              <div className="flex items-center gap-2">
                <p className="text-gray-400 text-xs">编号：12345678</p>
                {(identity==='principal') && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white">校长权限</span>
                )}
              </div>
          </div>
          <ChevronRight className="text-gray-300" />
       </div>

       <div className="space-y-3 mb-6">
           <h3 className="text-xs font-bold text-gray-400 ml-2">账户与数据管理</h3>
           {menuItems.map(renderItem)}
       </div>

       <div className="space-y-3">
           <h3 className="text-xs font-bold text-gray-400 ml-2">应用通用设置</h3>
           {bottomItems.map(renderItem)}
       </div>

      <button className="mt-8 w-full bg-white text-red-500 font-bold py-3 rounded-xl shadow-sm">
          退出登录
      </button>

      {permOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">校区权限</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={()=>{ setRoleSelection('teacher'); setIdentity('teacher'); setPrincipalVerified(false); setPrincipalPassword(''); }} className={`p-2 rounded-xl ${roleSelection==='teacher'?'bg-primary text-white':'bg-gray-100 text-gray-700'}`}>老师</button>
              <button onClick={()=>{ setRoleSelection('principal'); setPrincipalVerified(false); }} className={`p-2 rounded-xl ${roleSelection==='principal'?'bg-primary text-white':'bg-gray-100 text-gray-700'}`}>校长</button>
            </div>
            {roleSelection==='teacher' && (
              <div className="mb-3">
                <select value={teacherClass} onChange={e=>setTeacherClass(e.target.value)} className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none">
                  {classes.map(c=> (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            )}
            {roleSelection==='principal' && !principalVerified && (
              <div className="mb-3">
                <input value={principalPassword} onChange={e=>setPrincipalPassword(e.target.value)} placeholder="输入校长密码" type="password" className="w-full p-2 rounded-xl bg-gray-50 text-sm outline-none" />
                <button onClick={()=>{ if(principalPassword===PRINCIPAL_PASSWORD){ setPrincipalVerified(true); setIdentity('principal'); setPrincipalPassword(''); } }} className="w-full mt-2 p-2 rounded-xl bg-primary text-white text-sm font-bold">验证</button>
              </div>
            )}
            {(identity==='principal' && principalVerified) && (
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-2">班级名称管理</h4>
                <div className="flex items-center gap-2 mb-2">
                  <input value={newClassName} onChange={e=>setNewClassName(e.target.value)} placeholder="新增班级名称" className="flex-1 p-2 rounded-xl bg-white text-sm outline-none border" />
                  <button onClick={()=>{ if(newClassName.trim()){ setClasses([...classes, newClassName.trim()]); setNewClassName(''); } }} className="px-3 py-2 rounded-xl bg-primary text-white text-sm font-bold">新增</button>
                </div>
                <div className="space-y-2">
                  {classes.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input value={renameIndex===idx?renameValue:c} onChange={e=>{ setRenameIndex(idx); setRenameValue(e.target.value); }} className="flex-1 p-2 rounded-xl bg-white text-sm outline-none border" />
                      <button onClick={()=>{ const next=[...classes]; next[idx]=renameIndex===idx?renameValue:next[idx]; setClasses(next); setRenameIndex(null); setRenameValue(''); }} className="px-3 py-2 rounded-xl bg-primary text-white text-sm">保存</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button onClick={()=>setPermOpen(false)} className="flex-1 p-2 rounded-xl bg-gray-100 text-gray-700 text-sm">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

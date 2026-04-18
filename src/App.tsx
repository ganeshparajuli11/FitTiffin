/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useFitTiffin } from './hooks/useFitTiffin';
import { MEAL_PLAN } from './data/mealPlan';
import { BottomNav } from './components/Navigation';
import { 
  Coffee, 
  Sun, 
  Moon, 
  Droplets, 
  Footprints, 
  TrendingDown, 
  BarChart2,
  ChevronRight,
  Flame,
  Calendar,
  AlertCircle,
  Plus,
  Check,
  User,
  LogOut,
  Dumbbell
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { parseISO } from 'date-fns';
import { DailyLog } from './types';

import { useEffect } from 'react';

// --- Header ---
const AppHeader: React.FC = () => {
  const { profile, currentDayNumber, setTokens } = useFitTiffin();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_FIT_SUCCESS') {
        setTokens(event.data.tokens);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setTokens]);
  return (
    <header className="h-[72px] px-4 md:px-8 flex items-center justify-between border-b border-outline bg-white z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">FT</div>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-text-main leading-tight tracking-tight">FitTiffin</h1>
          <p className="text-[10px] text-text-sub font-medium -mt-1 uppercase tracking-wider">Simple meals. Steady fat loss.</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex bg-brand-primary text-white px-3 py-1 rounded-full text-[10px] font-bold">
          Day {currentDayNumber} of 30
        </div>
        <div className="text-right">
          <p className="text-xs font-bold leading-none">{format(new Date(), 'EEEE')}</p>
          <p className="text-[10px] text-text-sub">{format(new Date(), 'MMM d')}</p>
        </div>
      </div>
    </header>
  );
};

// --- Home Dashboard ---
const HomeDashboard: React.FC = () => {
  const { profile, currentDayNumber, todayLog, addWater, isSaturday, toggleHabit } = useFitTiffin();
  const dayPlan = MEAL_PLAN[(currentDayNumber - 1) % 30];
  const habitCompletion = Object.values(todayLog.habits).filter(Boolean).length;
  const habitTotal = Object.values(todayLog.habits).length;
  const habitPercent = Math.round((habitCompletion / habitTotal) * 100);

  const habitList = [
    { id: 'walk', label: '8,000 Steps Walked', icon: Footprints },
    { id: 'noJunk', label: 'No Junk Food', icon: AlertCircle },
    { id: 'noSugarDrinks', label: 'No Sugary Drinks', icon: Droplets },
    { id: 'sleepOnTime', label: 'Sleep by 11 PM', icon: Moon },
  ];

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6 pb-32 max-w-[1400px] mx-auto">
      {/* Left Column: Habits (Desktop Sidebar / Mobile First Section) */}
      <aside className="m3-card !p-5 flex flex-col order-2 lg:order-1 h-fit">
        <h3 className="card-header">Daily Habits</h3>
        <div className="space-y-4">
          {habitList.map((habit) => {
            const isDone = todayLog.habits[habit.id as keyof typeof todayLog.habits];
            return (
              <button 
                key={habit.id}
                onClick={() => toggleHabit(habit.id as any)}
                className="flex items-center gap-3 w-full text-left group"
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  isDone ? 'bg-brand-primary border-brand-primary' : 'border-outline group-hover:border-brand-primary/40'
                }`}>
                  {isDone && <Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm ${isDone ? 'text-text-main font-medium' : 'text-text-sub'}`}>{habit.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-8 bg-surface-variant p-4 rounded-2xl text-center">
          <p className="text-[10px] text-text-sub uppercase font-bold tracking-widest mb-1">Daily Score</p>
          <h2 className="text-3xl font-black text-brand-primary">{habitPercent}%</h2>
        </div>
      </aside>

      {/* Middle Column: Meal Plan */}
      <section className="space-y-4 order-1 lg:order-2">
        {isSaturday && (
          <div className="saturday-upgrade">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold">✨ Saturday Upgrade</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              It's a holiday! Let's do a 45-min walk today and prep your tiffin groceries for next week.
            </p>
          </div>
        )}

        <div className="m3-card !p-0 overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-outline bg-white/50">
            <h3 className="card-header !mb-0">Today's Menu</h3>
          </div>
          <div className="p-4 space-y-3">
             {[
                { id: 'breakfast', icon: '🥣', title: 'Breakfast', meal: dayPlan?.breakfast, time: '8:30 AM' },
                { id: 'lunch', icon: '🍱', title: 'Tiffin Lunch', meal: dayPlan?.lunch, time: '1:15 PM' },
                { id: 'dinner', icon: '🥗', title: 'Dinner', meal: dayPlan?.dinner, time: '7:45 PM' },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl bg-surface-variant group hover:bg-brand-container/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-text-main leading-none">{item.title}</h4>
                    <p className="text-[11px] text-text-sub truncate mt-1">{item.meal?.items.join(', ')}</p>
                  </div>
                  <div className="text-[10px] font-semibold text-text-sub whitespace-nowrap">
                    {item.time}
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-auto p-5 border-t border-outline border-dashed bg-slate-50/50">
            <p className="text-[11px] italic text-text-sub leading-relaxed">
              "Focus: {dayPlan?.tip}"
            </p>
          </div>
        </div>
      </section>

      {/* Right Column: Progress */}
      <aside className="m3-card !p-5 flex flex-col order-3 h-fit">
        <h3 className="card-header">Progress</h3>
        
        <div className="flex flex-col items-center justify-center py-4 border-b border-outline border-dashed">
            <div className="relative w-32 h-32 rounded-full border-[10px] border-brand-container flex items-center justify-center">
              <div 
                className="absolute inset-[-10px] rounded-full border-[10px] border-brand-primary border-t-transparent border-l-transparent transition-all" 
                style={{ transform: `rotate(${(todayLog.waterGlasses / profile.waterGoal) * 360}deg)` }}
              />
              <span className="text-2xl font-black text-text-main">{todayLog.waterGlasses}<span className="text-sm font-normal text-text-sub">/{profile.waterGoal}</span></span>
            </div>
            <p className="text-[11px] font-bold text-text-main mt-3">Water Goal (Glasses)</p>
            <button 
              onClick={addWater}
              className="mt-2 text-brand-primary font-bold text-xs uppercase hover:underline"
            >
              Add Glass +
            </button>
        </div>

        <div className="mt-6 space-y-3">
            {[
              { label: 'Start Weight', value: profile.currentWeight.toFixed(1) + ' kg', color: 'text-text-main' },
              { label: 'Current Weight', value: (todayLog.weight || profile.currentWeight).toFixed(1) + ' kg', color: 'text-brand-primary' },
              { label: 'Goal Weight', value: profile.goalWeight.toFixed(1) + ' kg', color: 'text-text-sub' },
              { label: 'Total Loss', value: (profile.currentWeight - (todayLog.weight || profile.currentWeight)).toFixed(1) + ' kg', color: 'text-emerald-500' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-text-sub font-medium">{stat.label}</span>
                <span className={`font-black ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
        </div>

        {/* Mini Chart Mockup */}
        <div className="mt-6 h-12 flex items-end gap-1.5 opacity-80">
          {[40, 55, 45, 70, 85, 80, 95].map((h, i) => (
            <div key={i} className={`flex-1 rounded-sm ${i > 3 ? 'bg-brand-primary' : 'bg-brand-container'}`} style={{ height: `${h}%` }}></div>
          ))}
        </div>
      </aside>
    </div>
  );
};

// --- Meal List View ---
const MealPlanView: React.FC = () => {
  const { currentDayNumber } = useFitTiffin();
  const [selectedDay, setSelectedDay] = React.useState(currentDayNumber > 30 ? 1 : currentDayNumber);

  return (
    <div className="pb-32 h-full flex flex-col">
       <div className="px-4 pt-4 mb-4">
        <h1 className="text-2xl font-bold">30-Day Plan</h1>
        <p className="text-text-muted text-sm">Tap a day to see the specific routine</p>
      </div>

      {/* Day Selector horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 no-scrollbar">
        {Array.from({ length: 30 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i + 1)}
            className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${
              selectedDay === i + 1 
                ? 'bg-brand-primary text-white shadow-lg' 
                : 'bg-white text-text-muted border border-slate-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 overflow-y-auto space-y-4">
        {selectedDay && (
          <motion.div 
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="m3-card bg-teal-50">
              <h2 className="font-bold flex items-center gap-2">
                Day {selectedDay}: {MEAL_PLAN[selectedDay - 1].focus}
              </h2>
              <p className="text-sm text-text-muted mt-2">{MEAL_PLAN[selectedDay - 1].tip}</p>
            </div>

            {['breakfast', 'lunch', 'dinner'].map((type) => {
              const meal = MEAL_PLAN[selectedDay - 1][type as keyof typeof MEAL_PLAN[0]] as any;
              return (
                <div key={type} className="m3-card">
                  <h3 className="text-[10px] font-bold uppercase text-text-muted mb-1">{type}</h3>
                  <p className="font-bold text-lg mb-2">{meal.name}</p>
                  <ul className="space-y-1">
                    {meal.items.map((item: string, idx: number) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-text-muted mt-3 italic">{meal.description}</p>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- Progress View ---
const ProgressView: React.FC = () => {
  const { profile, logs, todayLog, updateWeight } = useFitTiffin();

  const data = (Object.values(logs) as DailyLog[])
    .filter(log => log.weight)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)
    .map(log => ({
      date: format(parseISO(log.date), 'MMM d'),
      weight: log.weight
    }));

  const currentWeight = todayLog.weight || profile.currentWeight;
  const lost = profile.currentWeight - currentWeight;
  const toGoal = currentWeight - profile.goalWeight;

  return (
    <div className="pb-32 space-y-6 overflow-y-auto max-h-screen">
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold">Progress Tracking</h1>
        <p className="text-text-muted text-sm">Visualize your body transformation</p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4">
        <div className="m3-card bg-slate-900 text-white flex flex-col justify-center items-center py-8">
           <TrendingDown className="text-brand-muted mb-2" size={32} />
           <span className="text-3xl font-black">{lost.toFixed(1)}<span className="text-sm font-normal ml-1">kg</span></span>
           <span className="text-[10px] uppercase tracking-widest opacity-60">Weight Lost</span>
        </div>
        <div className="m3-card flex flex-col justify-center items-center py-8">
           <span className="text-3xl font-black text-brand-primary">{toGoal.toFixed(1)}<span className="text-sm font-normal ml-1 text-slate-400">kg</span></span>
           <span className="text-[10px] uppercase tracking-widest text-text-muted">To Goal</span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4">
        <div className="m3-card h-64 flex flex-col">
          <h3 className="font-bold text-sm mb-4">Weight Journey</h3>
          {data.length > 1 ? (
             <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data}>
               <defs>
                 <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
               <YAxis domain={['auto', 'auto']} fontSize={10} axisLine={false} tickLine={false} />
               <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
               />
               <Area type="monotone" dataKey="weight" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
             </AreaChart>
           </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-2 opacity-50">
              <BarChart2 size={48} />
              <p className="text-xs">Log weight for {2 - data.length} more days</p>
            </div>
          )}
        </div>
      </div>

      {/* Weight Input */}
      <div className="px-4">
        <div className="m3-card bg-brand-light border-brand-muted/50">
           <h3 className="font-bold text-sm mb-3">Update Current Weight</h3>
           <div className="flex gap-3">
             <input 
              type="number" 
              step="0.1" 
              placeholder={currentWeight.toString()} 
              className="m3-input flex-1"
              onBlur={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) updateWeight(val);
              }}
             />
             <button className="m3-button-primary">Save</button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Habits View ---
const HabitsView: React.FC = () => {
  const { todayLog, toggleHabit } = useFitTiffin();

  const habitList = [
    { id: 'breakfast', label: 'Healthy Breakfast', icon: Coffee },
    { id: 'lunch', label: 'Office Tiffin', icon: Sun },
    { id: 'dinner', label: 'Lighter Dinner', icon: Moon },
    { id: 'walk', label: 'Daily Walk Goal', icon: Footprints },
    { id: 'noJunk', label: 'No Junk Food', icon: AlertCircle },
    { id: 'noSugarDrinks', label: 'No Sugary Drinks', icon: Droplets },
    { id: 'sleepOnTime', label: 'Sleep Target Met', icon: Moon },
  ];

  return (
    <div className="pb-32 space-y-6">
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold">Daily Habits</h1>
        <p className="text-text-muted text-sm">Small actions, massive results</p>
      </div>

      <div className="px-4 space-y-3">
        {habitList.map((habit) => {
          const isDone = todayLog.habits[habit.id as keyof typeof todayLog.habits];
          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id as any)}
              className={`w-full m3-card flex items-center justify-between transition-all duration-300 ${
                isDone ? 'bg-brand-light border-brand-muted text-brand-secondary' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isDone ? 'bg-brand-muted text-brand-secondary' : 'bg-slate-50 text-text-muted'}`}>
                  <habit.icon size={20} />
                </div>
                <span className="font-bold text-sm tracking-tight">{habit.label}</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isDone ? 'bg-brand-secondary border-brand-secondary' : 'border-slate-200'
              }`}>
                {isDone && <Check size={14} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Settings View ---
const SettingsView: React.FC = () => {
  const { profile, setProfile, resetCycle, tokens } = useFitTiffin();

  const handleConnectGoogle = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.open(url, 'google_fit_auth', 'width=600,height=700');
    } catch (e) {
      console.error("Connect failed", e);
    }
  };

  return (
     <div className="pb-32 space-y-6 p-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="m3-card space-y-4">
        <h3 className="font-bold text-[#4285F4] flex items-center gap-2">
           <Dumbbell size={18} /> Wearable Integration
        </h3>
        <p className="text-xs text-text-sub">Connect Google Fit to automatically sync your daily steps from your {profile.name}'s phone.</p>
        {!tokens ? (
          <button 
            onClick={handleConnectGoogle}
            className="w-full bg-[#4285F4] text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:brightness-95 transition-all"
          >
            Connect Google Fit
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
             <Check size={18} />
             <span className="text-xs">Google Fit Connected</span>
          </div>
        )}
      </div>
      
      <div className="m3-card space-y-4">
        <h3 className="font-bold text-brand-primary flex items-center gap-2">
          <User size={18} /> Profile Details
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-text-muted ml-1">Full Name</label>
            <input 
              className="m3-input mt-1" 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-text-muted ml-1">Weight (kg)</label>
              <input 
                type="number"
                className="m3-input mt-1" 
                value={profile.currentWeight}
                onChange={e => setProfile({...profile, currentWeight: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-text-muted ml-1">Goal (kg)</label>
              <input 
                type="number"
                className="m3-input mt-1" 
                value={profile.goalWeight}
                onChange={e => setProfile({...profile, goalWeight: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="m3-card space-y-4 border-red-50">
        <h3 className="font-bold text-red-600 flex items-center gap-2">
          <LogOut size={18} /> Danger Zone
        </h3>
        <p className="text-xs text-text-muted">Restarting the cycle will reset your Day 1 to today. This cannot be undone.</p>
        <button 
          onClick={() => {
            if(confirm('Are you sure you want to restart the 30-day journey?')) resetCycle();
          }}
          className="w-full bg-red-50 text-red-600 py-3 rounded-2xl font-bold text-sm active:bg-red-100"
        >
          Restart 30-Day Cycle
        </button>
      </div>

      <div className="text-center opacity-30 py-8">
        <p className="text-xs font-bold uppercase tracking-widest">FitTiffin v1.0</p>
        <p className="text-[10px]">Simple meals. Steady fat loss.</p>
      </div>
    </div>
  );
};

// --- Main App Entry ---
export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <div className="min-h-screen bg-background relative selection:bg-brand-container selection:text-brand-primary flex flex-col font-sans">
      <AppHeader />
      <main className="flex-1 overflow-y-auto">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
           className="h-full"
        >
          {activeTab === 'home' && <HomeDashboard />}
          {activeTab === 'meals' && <MealPlanView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'habits' && <HabitsView />}
          {activeTab === 'settings' && <SettingsView />}
        </motion.div>
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

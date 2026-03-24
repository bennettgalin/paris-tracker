import { useState, useEffect } from "react";

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const TABS = ["Today", "Goals", "Running", "Weekly", "History"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["Breakfast", "Lunch", "Dinner"];

const CALORIE_GUIDE = {
  Breakfast: { light: "<250 kcal", medium: "<350 kcal", heavy: "500+ kcal" },
  Lunch:     { light: "250–500 kcal", medium: "500–750 kcal", heavy: "750+ kcal" },
  Dinner:    { light: "<500 kcal", medium: "500–1000 kcal", heavy: "1000+ kcal" },
};
const CALORIE_COLORS = { light: "#4caf82", medium: "#f0a500", heavy: "#e05c5c" };

const SNACK_RATINGS = [
  { key: "good",    label: "Good",    color: "#4caf82", icon: "🥦" },
  { key: "neutral", label: "Neutral", color: "#f0a500", icon: "🍌" },
  { key: "bad",     label: "Bad",     color: "#e05c5c", icon: "🍪" },
];
const SNACK_REASONS = ["Hungry", "Bored", "Habit", "Social", "Post-workout"];

const SLEEP_QUALITY = [
  { key: "great", label: "Great", color: "#4caf82" },
  { key: "okay",  label: "Okay",  color: "#f0a500" },
  { key: "poor",  label: "Poor",  color: "#e05c5c" },
];

const ALCOHOL_OPTIONS = [
  { key: "none",  label: "None",  sub: "0 drinks",  color: "#4caf82", pts: 2 },
  { key: "light", label: "Light", sub: "1–2 drinks", color: "#f0a500", pts: 1 },
  { key: "heavy", label: "Heavy", sub: "3+ drinks",  color: "#e05c5c", pts: 0 },
];

const HABITS = [
  { key: "pastry",   label: "Had a pastry",     bad: true,  icon: "🥐" },
  { key: "seconds",  label: "Took seconds",      bad: true,  icon: "🍽️" },
  { key: "dessert",  label: "Had dessert",       bad: true,  icon: "🍮" },
  { key: "dietSoda", label: "Had diet soda",     bad: true,  icon: "🥤" },
  { key: "ran",      label: "Went for a run",    bad: false, icon: "🏃" },
  { key: "walked",   label: "Walked 15k+ steps", bad: false, icon: "👟" },
];

const TRAINING_PLAN = [
  { week:1,  run:1, desc:"4.5 mile run @ 8:30 w/ strides at top and bottom of Champ de Mars" },
  { week:1,  run:2, desc:"Walk" },
  { week:1,  run:3, desc:"10 min WU @ 9:15 — 15 min @ 7:25 — 10 min CD @ 9:15" },
  { week:1,  run:4, desc:"3–4 Miles Easy Run (optional)", optional:true },
  { week:2,  run:1, desc:"4 miles easy + strides every mile" },
  { week:2,  run:2, desc:"1m WU @ 9:00 — 2 miles tempo @ 7:50 — 1m CD @ 9:00" },
  { week:2,  run:3, desc:"5–6 miles easy (8:20–8:50)" },
  { week:2,  run:4, desc:"4 miles easy (optional)", optional:true },
  { week:3,  run:1, desc:"4 miles reverse split (8:30, 8:15, 8:00, 7:45)" },
  { week:3,  run:2, desc:"1m WU @ 9:00 — 8 min @ 7:50 — 3 min @ 9:15 — 8 min @ 7:50 — 1m CD @ 8:45" },
  { week:3,  run:3, desc:"5 miles easy (8:20–8:50)" },
  { week:3,  run:4, desc:"4 miles easy (optional)", optional:true },
  { week:4,  run:1, desc:"4–5 miles easy (8:10–8:30)" },
  { week:4,  run:2, desc:"25 minutes at 8:00/mile" },
  { week:4,  run:3, desc:"5 miles easy (8:20–8:50)" },
  { week:4,  run:4, desc:"3 miles easy (optional)", optional:true },
  { week:5,  run:1, desc:"4 miles easy + strides every ½ mile" },
  { week:5,  run:2, desc:"1m WU @ 8:50 — 2 miles tempo @ 7:45 — 1m CD @ 8:50" },
  { week:5,  run:3, desc:"6 miles easy (8:30–9:00)" },
  { week:5,  run:4, desc:"3 miles easy (optional)", optional:true },
  { week:6,  run:1, desc:"4 miles reverse split (8:30, 8:15, 8:00, 7:45)" },
  { week:6,  run:2, desc:"5 min WU @ 9:00 — 1m @ 7:50 — 5 min @ 9:00 — 1m @ 7:45 — 10 min @ 8:45" },
  { week:6,  run:3, desc:"5 miles easy (8:30–9:00)" },
  { week:6,  run:4, desc:"4 miles easy (optional)", optional:true },
  { week:7,  run:1, desc:"4 miles easy + strides every ½ mile" },
  { week:7,  run:2, desc:"5K at 7:50/mile" },
  { week:7,  run:3, desc:"6 miles easy (8:30–9:00)" },
  { week:7,  run:4, desc:"4 miles easy (optional)", optional:true },
  { week:8,  run:1, desc:"4 miles reverse split (8:20, 8:05, 7:50, 7:35)" },
  { week:8,  run:2, desc:"5 min WU @ 8:45 — 20 min @ 7:45 — 5 min CD @ 8:45" },
  { week:8,  run:3, desc:"5 miles easy (8:20–8:50)" },
  { week:8,  run:4, desc:"3 miles easy (optional)", optional:true },
  { week:9,  run:1, desc:"4–5 miles easy (8:10–8:30)" },
  { week:9,  run:2, desc:"5 min WU @ 8:45 — 3 × 1 mile @ 7:30 w/ 2 min rest @ 9:15 — 5 min CD @ 8:45" },
  { week:9,  run:3, desc:"4–5 miles easy (8:10–8:30)" },
  { week:9,  run:4, desc:"3 miles easy (optional)", optional:true },
  { week:10, run:1, desc:"4 miles easy + strides every ½ mile" },
  { week:10, run:2, desc:"1m WU @ 9:00 — 2 miles tempo @ 7:45 — 1m CD @ 9:00" },
  { week:10, run:3, desc:"7 miles very easy (8:45–9:15)" },
  { week:10, run:4, desc:"3 miles easy (optional)", optional:true },
  { week:11, run:1, desc:"4 miles reverse split (8:15, 8:00, 7:45, 7:30)" },
  { week:11, run:2, desc:"5K at 7:45/mile" },
  { week:11, run:3, desc:"5 miles easy (8:20–8:50)" },
  { week:12, run:1, desc:"4 miles easy + strides every ½ mile" },
  { week:12, run:2, desc:"5 min WU @ 8:45 — 4 × 1 mile @ 7:30 w/ 2 min rest @ 9:15 — 5 min CD @ 8:45" },
  { week:12, run:3, desc:"🏁 5K Time Trial — Sub-20 Goal" },
];

function getRunType(desc) {
  const d = desc.toLowerCase();
  if (d.includes("time trial") || d.includes("🏁")) return "trial";
  if (d.includes("5k at")) return "race";
  if (d.includes("×") || d.includes("strides")) return "interval";
  if (d.includes("tempo") || d.includes("wu") || d.includes("reverse split")) return "tempo";
  if (d === "walk") return "walk";
  return "easy";
}
const TYPE_COLOR = { easy:"#4a9eff", tempo:"#f0a500", interval:"#e05c5c", walk:"#8bc34a", race:"#c9a96e", trial:"#c9a96e" };

const DEFAULT_GOALS = [
  { id:1, type:"big",    title:"Under 175 lbs by May 15",    desc:"Return to the US lighter and leaner", progress:0,  target:100, unit:"%",   completed:false, lowerIsBetter:false },
  { id:2, type:"big",    title:"Sub-20 minute 5K",           desc:"Log a 5K PR to track progress",       progress:null, target:20, unit:"min", completed:false, lowerIsBetter:true  },
  { id:3, type:"big",    title:"Feel great about how I look",desc:"General wellbeing and confidence",    progress:0,  target:100, unit:"%",   completed:false, lowerIsBetter:false },
  { id:4, type:"weekly", title:"No diet soda this week",     desc:"",                                    progress:0,  target:7,   unit:"days",completed:false, lowerIsBetter:false },
  { id:5, type:"weekly", title:"Run 3× this week",           desc:"",                                    progress:0,  target:3,   unit:"runs",completed:false, lowerIsBetter:false },
  { id:6, type:"weekly", title:"No pastries Mon–Fri",        desc:"",                                    progress:0,  target:5,   unit:"days",completed:false, lowerIsBetter:false },
];

const emptyMeal  = () => ({ text:"", selfGrade:null, aiGrade:null, aiEmoji:null, aiFeedback:null, aiProtein:null, aiConcern:null, calories:null, grading:false });
const emptySnack = () => ({ text:"", selfRating:null, aiGrade:null, aiEmoji:null, aiFeedback:null, reason:null, grading:false });
const emptyDay   = () => ({
  meals:   { Breakfast: emptyMeal(), Lunch: emptyMeal(), Dinner: emptyMeal() },
  snacks:  [],
  habits:  { pastry:null, seconds:null, dessert:null, dietSoda:null, ran:null, walked:null },
  alcohol: null,
  caffeine: null,
  runNote: "", screenTime: "",
  sleep:   { hours:"", quality:null },
  selfScore: null, selfNote: "",
});

// ── SCORING ───────────────────────────────────────────────────────────────────
const DAY_MAX = 17;
function calcDayScore(d) {
  let s = 0;
  MEALS.forEach(m => { const g = d.meals[m]?.aiGrade; if (g != null) s += Math.round(g); });
  (d.snacks||[]).forEach(sn => { if (sn.selfRating==="good") s += 1; else if (sn.selfRating==="bad") s = Math.max(0,s-1); });
  if (d.habits.ran)    s += 2;
  if (d.habits.walked) s += 1;
  const alc = ALCOHOL_OPTIONS.find(o => o.key === d.alcohol);
  s += alc ? alc.pts : 2; // no answer = assume none for score
  if (!d.habits.pastry) s += 1;
  if (d.sleep?.hours && parseFloat(d.sleep.hours) >= 7) s += 1;
  return Math.min(s, DAY_MAX);
}
function scoreLabel(score) {
  const p = score / DAY_MAX;
  if (p >= 0.82) return { text:"Excellent", color:"#4caf82" };
  if (p >= 0.62) return { text:"Good",      color:"#8bc34a" };
  if (p >= 0.42) return { text:"Fair",      color:"#f0a500" };
  return              { text:"Tough day",  color:"#e05c5c" };
}
function gradeColor(g) { if (g==null) return "#4a3820"; if (g>=2.5) return "#4caf82"; if (g>=1.5) return "#f0a500"; return "#e05c5c"; }
function gradeLabel(g) { if (g==null) return ""; if (g>=2.5) return "Great"; if (g>=1.5) return "Fair"; return "Poor"; }

// ── STREAK ────────────────────────────────────────────────────────────────────
function calcStreak(pastWeeks, currentDays) {
  const all = [];
  pastWeeks.forEach(pw => pw.days.forEach(d => all.push(d)));
  currentDays.forEach(d => all.push(d));
  let streak = 0;
  for (let i = all.length-1; i >= 0; i--) {
    const hasData = Object.values(all[i].meals).some(m => m.aiGrade != null);
    if (!hasData) continue;
    if (calcDayScore(all[i]) / DAY_MAX >= 0.62) streak++;
    else break;
  }
  return streak;
}

// ── STORAGE ───────────────────────────────────────────────────────────────────
const SK = "paris_v5";
function load() { try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : null; } catch { return null; } }
function persist(s) { try { localStorage.setItem(SK, JSON.stringify(s)); } catch {} }

// ── AI ────────────────────────────────────────────────────────────────────────
async function callClaude(system, user) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:300, system, messages:[{role:"user",content:user}] }),
  });
  const data = await res.json();
  const raw = data?.content?.[0]?.text || "";
  const match = raw.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error("no json");
  return JSON.parse(match[0]);
}

const MEAL_SYS = `You are a strict, unbiased nutrition coach for Bennett — a 20-year-old college athlete studying abroad in Paris. Goals: lose weight to under 175 lbs by May 15, run sub-20 min 5K. He eats with a French host mother at dinner.

Be SPECIFIC and HONEST. Do NOT default to grade 2. Use the full scale.

Grade scale:
3 = Excellent: genuinely light and nutritious. yogurt, fruit, salad with lean protein, grilled fish/chicken with vegetables, broth soup, small balanced portions
2 = Fair: acceptable but not optimal. sandwich, moderate pasta portion, eggs and toast, one normal serving of a heavier dish, mixed salad with croutons
1 = Poor: high calorie or indulgent. burger, large pasta, fried food, creamy sauce, heavy bread, large portions of anything rich
0 = Very poor: pastry, croissant, fast food, pizza, multiple indulgent items, or very large portions

Respond ONLY in raw JSON (no markdown, no code blocks, no explanation):
{"grade":<0|1|2|3>,"feedback":"<max 12 words, specific to what they ate>","emoji":"<one emoji>","protein":"<low|medium|high>","concern":"<null or specific concern under 8 words>"}`;

const SNACK_SYS = `Strict nutrition coach for Bennett (goals: lose weight, sub-20 5K). Grade snacks honestly.
good = genuinely healthy: fruit, small handful nuts, plain yogurt, protein-focused
neutral = not harmful but not helpful: small crackers, a few bites of something moderate  
bad = unhealthy: pastry, chips, candy, cookies, large portions of anything sugary or fatty

Respond ONLY in raw JSON:
{"grade":"<good|neutral|bad>","feedback":"<max 10 words>","emoji":"<one emoji>"}`;

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const saved = load();
  const [tab, setTab]                       = useState("Today");
  const [currentWeek, setCurrentWeek]       = useState(saved?.currentWeek ?? 1);
  const [days, setDays]                     = useState(saved?.days ?? DAYS_SHORT.map(() => emptyDay()));
  const [activeDay, setActiveDay]           = useState(() => { const d = new Date().getDay(); return d===0?6:d-1; });
  const [pastWeeks, setPastWeeks]           = useState(saved?.pastWeeks ?? []);
  const [goals, setGoals]                   = useState(saved?.goals ?? DEFAULT_GOALS);
  const [trainingWeek, setTrainingWeek]     = useState(saved?.trainingWeek ?? 1);
  const [completedRuns, setCompletedRuns]   = useState(saved?.completedRuns ?? {});
  const [customRuns, setCustomRuns]         = useState(saved?.customRuns ?? {});
  const [runNotes, setRunNotes]             = useState(saved?.runNotes ?? {});
  const [editingGoal, setEditingGoal]       = useState(null);
  const [newGoalForm, setNewGoalForm]       = useState(null);
  const [showCloseWeek, setShowCloseWeek]   = useState(false);
  const [editingRun, setEditingRun]         = useState(null);
  const [logging5K, setLogging5K]           = useState(false);
  const [prInput, setPrInput]               = useState("");

  useEffect(() => {
    persist({ currentWeek, days, pastWeeks, goals, trainingWeek, completedRuns, customRuns, runNotes });
  }, [currentWeek, days, pastWeeks, goals, trainingWeek, completedRuns, customRuns, runNotes]);

  const day = days[activeDay];
  const todayScore = calcDayScore(day);
  const todayLabel = scoreLabel(todayScore);
  const streak = calcStreak(pastWeeks, days);
  const weekdayScore = days.reduce((s,d) => s + calcDayScore(d), 0);
  const weekPct = Math.round(weekdayScore / (7 * DAY_MAX) * 100);

  function updateDay(patch) {
    setDays(prev => { const n=[...prev]; n[activeDay]={...prev[activeDay],...patch}; return n; });
  }
  function setHabit(key, val) { updateDay({ habits:{ ...day.habits, [key]:val } }); }
  function setMealField(meal, patch) {
    setDays(prev => { const n=[...prev]; n[activeDay]={...prev[activeDay], meals:{...prev[activeDay].meals,[meal]:{...prev[activeDay].meals[meal],...patch}}}; return n; });
  }
  function updateSnack(idx, patch) {
    const s=[...(day.snacks||[])]; s[idx]={...s[idx],...patch}; updateDay({snacks:s});
  }
  function removeSnack(idx) { updateDay({snacks:(day.snacks||[]).filter((_,i)=>i!==idx)}); }
  function addSnack() { updateDay({snacks:[...(day.snacks||[]),emptySnack()]}); }

  async function gradeMeal(meal) {
    const text = day.meals[meal].text.trim();
    if (!text) return;
    setMealField(meal, {grading:true});
    try {
      const cals = day.meals[meal].calories;
      const self = day.meals[meal].selfGrade;
      const ctx = `${meal}: "${text}"${cals?` (self-assessed calories: ${cals}, which is ${CALORIE_GUIDE[meal][cals]})`:""}${self!=null?` (user self-graded: ${self}/3)`:""}`;
      const r = await callClaude(MEAL_SYS, ctx);
      setMealField(meal, {aiGrade:r.grade, aiEmoji:r.emoji, aiFeedback:r.feedback, aiProtein:r.protein, aiConcern:r.concern, grading:false});
    } catch {
      // keyword fallback
      const t = text.toLowerCase();
      let g = 2;
      if (/croissant|pastry|burger|fries|pizza|fried|cream sauce|cake|chocolate|chips/.test(t)) g=0;
      else if (/salad|soup|yogurt|fruit|grilled|fish|chicken|vegetable|steamed/.test(t)) g=3;
      else if (/sandwich|pasta|egg|toast|rice|omelette/.test(t)) g=1;
      setMealField(meal, {aiGrade:g, aiEmoji:"🍽️", aiFeedback:"Graded offline — check connection.", grading:false});
    }
  }

  async function gradeSnack(idx) {
    const sn = day.snacks[idx];
    if (!sn.text.trim()) return;
    updateSnack(idx, {grading:true});
    try {
      const ctx = `Snack: "${sn.text}"${sn.reason?`, reason: ${sn.reason}`:""}${sn.selfRating?`, self-rated: ${sn.selfRating}`:""}`;
      const r = await callClaude(SNACK_SYS, ctx);
      updateSnack(idx, {aiGrade:r.grade, aiEmoji:r.emoji, aiFeedback:r.feedback, grading:false});
    } catch {
      const t = sn.text.toLowerCase();
      const g = /fruit|yogurt|nuts|protein/.test(t) ? "good" : /pastry|chips|candy|cookie|cake/.test(t) ? "bad" : "neutral";
      updateSnack(idx, {aiGrade:g, aiEmoji:"🍽️", aiFeedback:"Graded offline.", grading:false});
    }
  }

  function closeWeek() {
    const total = days.reduce((s,d)=>s+calcDayScore(d),0);
    const max = 7*DAY_MAX;
    const habitAvg={};
    HABITS.forEach(h=>{
      const vals=days.filter(d=>d.habits[h.key]!==null).map(d=>d.habits[h.key]?1:0);
      habitAvg[h.key]=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*100):null;
    });
    const screens=days.filter(d=>d.screenTime).map(d=>parseFloat(d.screenTime)).filter(Boolean);
    const sleeps=days.filter(d=>d.sleep?.hours).map(d=>parseFloat(d.sleep.hours)).filter(Boolean);
    const selfs=days.filter(d=>d.selfScore).map(d=>d.selfScore);
    const report={
      pct:Math.round(total/max*100), total, max, habitAvg,
      avgScreen:screens.length?(screens.reduce((a,b)=>a+b,0)/screens.length).toFixed(1):null,
      avgSleep:sleeps.length?(sleeps.reduce((a,b)=>a+b,0)/sleeps.length).toFixed(1):null,
      avgSelf:selfs.length?(selfs.reduce((a,b)=>a+b,0)/selfs.length).toFixed(1):null,
    };
    setPastWeeks(p=>[...p,{week:currentWeek,days:JSON.parse(JSON.stringify(days)),report}]);
    setCurrentWeek(w=>w+1);
    setTrainingWeek(w=>Math.min(w+1,12));
    setDays(DAYS_SHORT.map(()=>emptyDay()));
    setShowCloseWeek(false);
  }

  function log5K() {
    const t = parseFloat(prInput);
    if (!t || t<=0) return;
    setGoals(p=>p.map(g=>g.id===2?{...g,progress:t,desc:`Best time: ${t} min — target: 20:00`}:g));
    setLogging5K(false);
    setPrInput("");
  }

  function saveGoal(g) { setGoals(p=>p.map(x=>x.id===g.id?g:x)); setEditingGoal(null); }
  function addGoal(g) { setGoals(p=>[...p,{...g,id:Date.now()}]); setNewGoalForm(null); }
  function deleteGoal(id) { setGoals(p=>p.filter(x=>x.id!==id)); }
  function toggleComplete(id) { setGoals(p=>p.map(x=>x.id===id?{...x,completed:!x.completed}:x)); }
  function toggleRun(key) { setCompletedRuns(p=>({...p,[key]:!p[key]})); }
  function saveCustomRun(key,text) { setCustomRuns(p=>({...p,[key]:text})); setEditingRun(null); }
  function resetCustomRun(key) { setCustomRuns(p=>{const n={...p};delete n[key];return n;}); setEditingRun(null); }
  function saveRunNote(key,text) { setRunNotes(p=>({...p,[key]:text})); }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#0d0b08",color:"#e8dcc8",fontFamily:"'DM Sans',sans-serif",maxWidth:480,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box}button,input,textarea{font-family:'DM Sans',sans-serif}::-webkit-scrollbar{width:0}.btn{transition:all 0.15s}.btn:active{transform:scale(0.97)}`}</style>

      {/* HEADER */}
      <div style={{padding:"22px 20px 0",background:"linear-gradient(180deg,#1a1208 0%,#0d0b08 100%)",borderBottom:"1px solid rgba(201,169,110,0.15)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{fontSize:10,letterSpacing:4,color:"#6a5030",textTransform:"uppercase",marginBottom:3}}>Paris · Week {currentWeek}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:25,lineHeight:1.1}}>Bennett's Tracker</div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {streak>0&&(
              <div style={{textAlign:"center",background:"rgba(201,169,110,0.1)",border:"1px solid rgba(201,169,110,0.25)",borderRadius:10,padding:"6px 10px"}}>
                <div style={{fontSize:16}}>🔥</div>
                <div style={{fontSize:12,fontWeight:700,color:"#c9a96e"}}>{streak}</div>
                <div style={{fontSize:8,color:"#6a5030",letterSpacing:1}}>STREAK</div>
              </div>
            )}
            {tab==="Today"&&(
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:700,color:todayLabel.color}}>{todayScore}</div>
                <div style={{fontSize:10,color:todayLabel.color,letterSpacing:1}}>{todayLabel.text}</div>
              </div>
            )}
          </div>
        </div>
        <div style={{display:"flex"}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{
              flex:1,background:"none",border:"none",cursor:"pointer",
              padding:"9px 0 8px",fontSize:11,letterSpacing:1,
              color:tab===t?"#c9a96e":"#4a3820",
              borderBottom:tab===t?"2px solid #c9a96e":"2px solid transparent",
              fontWeight:tab===t?700:400,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"18px 20px 100px"}}>

        {/* ══ TODAY ══════════════════════════════════════════════════════════ */}
        {tab==="Today"&&<>
          {/* Day tabs */}
          <div style={{display:"flex",gap:4,marginBottom:20}}>
            {DAYS_SHORT.map((d,i)=>{
              const sc=calcDayScore(days[i]);
              const active=i===activeDay;
              const hasData=Object.values(days[i].meals).some(m=>m.aiGrade!=null);
              const col=hasData?scoreLabel(sc).color:"#2a1f10";
              return(
                <button key={i} onClick={()=>setActiveDay(i)} className="btn" style={{
                  flex:1,padding:"8px 2px",borderRadius:8,cursor:"pointer",textAlign:"center",
                  border:active?"1.5px solid #c9a96e":"1px solid rgba(255,255,255,0.06)",
                  background:active?"rgba(201,169,110,0.1)":"rgba(255,255,255,0.02)",
                }}>
                  <div style={{fontSize:9,color:active?"#c9a96e":"#4a3820",marginBottom:3,letterSpacing:1}}>{d}</div>
                  <div style={{fontSize:12,fontWeight:700,color:col}}>{hasData?sc:"·"}</div>
                </button>
              );
            })}
          </div>

          {/* Score bar */}
          <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,marginBottom:22,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(todayScore/DAY_MAX)*100}%`,background:todayLabel.color,transition:"width 0.4s",borderRadius:2}}/>
          </div>

          {/* SLEEP */}
          <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px 14px",marginBottom:20}}>
            <div style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"#a78b5e",marginBottom:8}}>Sleep</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <input type="number" step="0.5" value={day.sleep?.hours||""} onChange={e=>updateDay({sleep:{...day.sleep,hours:e.target.value}})}
                placeholder="Hours slept" style={{...IS,flex:1,padding:"7px 10px"}}/>
              <span style={{fontSize:11,color:"#6a5030"}}>hrs</span>
              {day.sleep?.hours&&<span style={{fontSize:11,fontWeight:700,color:parseFloat(day.sleep.hours)>=7?"#4caf82":parseFloat(day.sleep.hours)>=6?"#f0a500":"#e05c5c"}}>
                {parseFloat(day.sleep.hours)>=7?"✓ Good":"⚠ Short"}
              </span>}
            </div>
            <div style={{display:"flex",gap:6}}>
              {SLEEP_QUALITY.map(q=>(
                <button key={q.key} className="btn" onClick={()=>updateDay({sleep:{...day.sleep,quality:q.key}})} style={{
                  flex:1,padding:"6px 0",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,
                  border:day.sleep?.quality===q.key?`1.5px solid ${q.color}`:"1px solid rgba(255,255,255,0.08)",
                  background:day.sleep?.quality===q.key?q.color+"22":"transparent",
                  color:day.sleep?.quality===q.key?q.color:"#4a3820",
                }}>{q.label}</button>
              ))}
            </div>
          </div>

          {/* MEALS */}
          <Sec label="Meals">
            {MEALS.map(meal=>(
              <MealCard key={meal} meal={meal} data={day.meals[meal]}
                onTextChange={t=>setMealField(meal,{text:t,aiGrade:null,aiFeedback:null,aiEmoji:null,aiProtein:null,aiConcern:null})}
                onSelfGrade={g=>setMealField(meal,{selfGrade:g})}
                onCalories={c=>setMealField(meal,{calories:c})}
                onGrade={()=>gradeMeal(meal)}/>
            ))}
          </Sec>

          {/* SNACKS */}
          <Sec label="Snacks">
            {(day.snacks||[]).map((sn,idx)=>(
              <SnackCard key={idx} snack={sn}
                onUpdate={patch=>updateSnack(idx,patch)}
                onGrade={()=>gradeSnack(idx)}
                onRemove={()=>removeSnack(idx)}/>
            ))}
            <button onClick={addSnack} className="btn" style={{
              width:"100%",padding:"10px",borderRadius:9,cursor:"pointer",
              border:"1px dashed rgba(201,169,110,0.3)",background:"transparent",color:"#6a5030",fontSize:12,letterSpacing:1,
            }}>+ Log a snack</button>
          </Sec>

          {/* HABITS */}
          <Sec label="Habits">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {HABITS.map(h=>{
                const val=day.habits[h.key];
                const answered=val!==null;
                const good=h.bad?val===false:val===true;
                return(
                  <div key={h.key} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${answered?(good?"#4caf8244":"#e05c5c44"):"rgba(255,255,255,0.07)"}`,borderRadius:9,padding:"10px 10px 8px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}>
                      <span style={{fontSize:15}}>{h.icon}</span>
                      <span style={{fontSize:11,color:"#a09070",lineHeight:1.3}}>{h.label}</span>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                      {["Yes","No"].map(opt=>{
                        const isYes=opt==="Yes";
                        const sel=val===isYes;
                        const isGood=h.bad?!isYes:isYes;
                        return(
                          <button key={opt} className="btn" onClick={()=>setHabit(h.key,isYes)} style={{
                            flex:1,padding:"5px 0",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,
                            border:sel?`1.5px solid ${isGood?"#4caf82":"#e05c5c"}`:"1px solid rgba(255,255,255,0.08)",
                            background:sel?(isGood?"#4caf8220":"#e05c5c20"):"rgba(255,255,255,0.03)",
                            color:sel?(isGood?"#4caf82":"#e05c5c"):"#4a3820",
                          }}>{opt}</button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Sec>

          {/* RUN NOTE */}
          {day.habits.ran&&(
            <Sec label="Run Details">
              <textarea value={day.runNote||""} onChange={e=>updateDay({runNote:e.target.value})}
                placeholder="Distance, time, pace, route, how it felt, any issues..."
                style={{...IS,resize:"none",height:80}}/>
            </Sec>
          )}

          {/* ALCOHOL */}
          <Sec label="Alcohol">
            <div style={{display:"flex",gap:6}}>
              {ALCOHOL_OPTIONS.map(opt=>(
                <button key={opt.key} className="btn" onClick={()=>updateDay({alcohol:opt.key})} style={{
                  flex:1,padding:"10px 6px",borderRadius:8,cursor:"pointer",textAlign:"center",
                  border:day.alcohol===opt.key?`1.5px solid ${opt.color}`:"1px solid rgba(255,255,255,0.08)",
                  background:day.alcohol===opt.key?opt.color+"18":"rgba(255,255,255,0.02)",
                }}>
                  <div style={{fontSize:12,fontWeight:700,color:day.alcohol===opt.key?opt.color:"#4a3820"}}>{opt.label}</div>
                  <div style={{fontSize:10,color:"#6a5030",marginTop:2}}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </Sec>

          {/* CAFFEINE */}
          <Sec label="Coffees today">
            <div style={{display:"flex",gap:5}}>
              {[0,1,2,3,4,5].map(n=>(
                <button key={n} className="btn" onClick={()=>updateDay({caffeine:n})} style={{
                  flex:1,padding:"9px 0",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,
                  border:day.caffeine===n?"1.5px solid #c9a96e":"1px solid rgba(255,255,255,0.08)",
                  background:day.caffeine===n?"rgba(201,169,110,0.18)":"rgba(255,255,255,0.02)",
                  color:day.caffeine===n?"#c9a96e":"#4a3820",
                }}>{n===5?"5+":n}☕</button>
              ))}
            </div>
            {day.caffeine>=3&&<div style={{fontSize:11,color:"#f0a500",marginTop:7}}>⚠ High caffeine can affect sleep quality</div>}
          </Sec>

          {/* SCREEN TIME */}
          <Sec label="Screen Time">
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <input type="number" value={day.screenTime||""} onChange={e=>updateDay({screenTime:e.target.value})}
                placeholder="Hours" style={{...IS,flex:1}}/>
              <span style={{fontSize:13,color:"#6a5030"}}>hrs</span>
              {day.screenTime&&<span style={{fontSize:12,fontWeight:700,color:parseFloat(day.screenTime)<=2?"#4caf82":parseFloat(day.screenTime)<=4?"#f0a500":"#e05c5c"}}>
                {parseFloat(day.screenTime)<=2?"Great":parseFloat(day.screenTime)<=4?"Okay":"High"}
              </span>}
            </div>
          </Sec>

          {/* SELF ASSESSMENT */}
          <Sec label="How did today feel? (1–10)">
            <div style={{display:"flex",gap:4,marginBottom:10}}>
              {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                <button key={n} className="btn" onClick={()=>updateDay({selfScore:n})} style={{
                  flex:1,padding:"7px 0",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,
                  border:day.selfScore===n?"1.5px solid #c9a96e":"1px solid rgba(255,255,255,0.07)",
                  background:day.selfScore===n?"rgba(201,169,110,0.2)":"rgba(255,255,255,0.02)",
                  color:day.selfScore===n?"#c9a96e":"#4a3820",
                }}>{n}</button>
              ))}
            </div>
            <textarea value={day.selfNote||""} onChange={e=>updateDay({selfNote:e.target.value})}
              placeholder="Wins, struggles, energy levels, how your body feels..."
              style={{...IS,resize:"none",height:80}}/>
          </Sec>
        </>}

        {/* ══ GOALS ══════════════════════════════════════════════════════════ */}
        {tab==="Goals"&&<>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,marginBottom:6}}>Your Goals</div>
          <div style={{fontSize:12,color:"#6a5030",marginBottom:20}}>Track what matters. Edit anytime.</div>

          {/* 5K PR logger */}
          <div style={{background:"rgba(201,169,110,0.07)",border:"1px solid rgba(201,169,110,0.2)",borderRadius:11,padding:"14px",marginBottom:20}}>
            <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"#a78b5e",marginBottom:6}}>Log a 5K Time</div>
            {logging5K?(
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" step="0.01" value={prInput} onChange={e=>setPrInput(e.target.value)}
                  placeholder="e.g. 21.45" style={{...IS,flex:1,padding:"9px 12px"}}/>
                <span style={{fontSize:12,color:"#6a5030"}}>min</span>
                <button onClick={log5K} style={{padding:"9px 14px",borderRadius:8,cursor:"pointer",border:"none",background:"#c9a96e",color:"#0e0c06",fontSize:12,fontWeight:700}}>Save PR</button>
                <button onClick={()=>setLogging5K(false)} style={{padding:"9px 10px",borderRadius:8,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#6a5030",fontSize:12}}>✕</button>
              </div>
            ):(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:"#8a7060"}}>
                  {goals.find(g=>g.id===2)?.progress!=null
                    ? `Best: ${goals.find(g=>g.id===2).progress} min → target 20:00`
                    : "No time logged yet"}
                </span>
                <button onClick={()=>setLogging5K(true)} style={{padding:"7px 14px",borderRadius:8,cursor:"pointer",border:"1px solid rgba(201,169,110,0.4)",background:"transparent",color:"#c9a96e",fontSize:12,fontWeight:700}}>Log time</button>
              </div>
            )}
          </div>

          {["big","weekly"].map(type=>(
            <div key={type} style={{marginBottom:28}}>
              <div style={{fontSize:10,letterSpacing:4,textTransform:"uppercase",color:"#a78b5e",marginBottom:12}}>
                {type==="big"?"Big Goals":"Weekly Goals"}
              </div>
              {goals.filter(g=>g.type===type).map(g=>
                editingGoal?.id===g.id
                  ?<GoalEditor key={g.id} goal={editingGoal} onChange={setEditingGoal} onSave={()=>saveGoal(editingGoal)} onCancel={()=>setEditingGoal(null)}/>
                  :<GoalCard key={g.id} goal={g} onEdit={()=>setEditingGoal({...g})} onDelete={()=>deleteGoal(g.id)} onToggle={()=>toggleComplete(g.id)}/>
              )}
              <button onClick={()=>setNewGoalForm({type,title:"",desc:"",progress:0,target:100,unit:"%",completed:false,lowerIsBetter:false})} style={{
                width:"100%",padding:"10px",borderRadius:9,cursor:"pointer",marginTop:4,
                border:"1px dashed rgba(201,169,110,0.3)",background:"transparent",color:"#6a5030",fontSize:12,letterSpacing:1,
              }}>+ Add {type==="big"?"big":"weekly"} goal</button>
            </div>
          ))}
          {newGoalForm&&<GoalEditor goal={newGoalForm} onChange={setNewGoalForm} onSave={()=>addGoal(newGoalForm)} onCancel={()=>setNewGoalForm(null)} isNew/>}
        </>}

        {/* ══ RUNNING ════════════════════════════════════════════════════════ */}
        {tab==="Running"&&<>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,marginBottom:4}}>12-Week Plan</div>
          <div style={{fontSize:12,color:"#6a5030",marginBottom:16}}>~22 min 5K → Sub-20 · Tap ✎ to swap a run</div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,padding:"12px 14px",background:"rgba(201,169,110,0.07)",border:"1px solid rgba(201,169,110,0.2)",borderRadius:10}}>
            <button className="btn" onClick={()=>setTrainingWeek(w=>Math.max(1,w-1))} style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#c9a96e",cursor:"pointer",padding:"4px 12px",fontSize:18}}>‹</button>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:10,color:"#a78b5e",letterSpacing:2}}>TRAINING WEEK</div>
              <div style={{fontSize:24,fontWeight:700,color:"#c9a96e"}}>{trainingWeek} / 12</div>
            </div>
            <button className="btn" onClick={()=>setTrainingWeek(w=>Math.min(12,w+1))} style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#c9a96e",cursor:"pointer",padding:"4px 12px",fontSize:18}}>›</button>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6a5030",marginBottom:5}}>
              <span>Overall completion</span>
              <span>{Object.values(completedRuns).filter(Boolean).length} / {TRAINING_PLAN.length} runs</span>
            </div>
            <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(Object.values(completedRuns).filter(Boolean).length/TRAINING_PLAN.length)*100}%`,background:"#c9a96e",borderRadius:2}}/>
            </div>
          </div>
          {TRAINING_PLAN.filter(r=>r.week===trainingWeek).map(run=>{
            const key=`w${run.week}-r${run.run}`;
            const done=!!completedRuns[key];
            const custom=customRuns[key];
            const displayDesc=custom||run.desc;
            const type=getRunType(displayDesc);
            const isEditing=editingRun===key;
            const note=runNotes[key]||"";
            return(
              <div key={key} style={{padding:"13px 14px",borderRadius:10,marginBottom:10,border:`1px solid ${done?"#4caf8233":"rgba(255,255,255,0.07)"}`,background:done?"rgba(76,175,130,0.05)":"rgba(255,255,255,0.02)"}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <button className="btn" onClick={()=>toggleRun(key)} style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${done?"#4caf82":"rgba(255,255,255,0.2)"}`,background:done?"#4caf82":"transparent",cursor:"pointer",flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#0d0b08"}}>
                    {done&&"✓"}
                  </button>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:10,fontWeight:700,color:"#0d0b08",background:TYPE_COLOR[type],padding:"2px 8px",borderRadius:4,letterSpacing:1,textTransform:"uppercase"}}>{type}</span>
                      <span style={{fontSize:11,color:"#6a5030"}}>Run {run.run}{run.optional?" · optional":""}</span>
                      {custom&&<span style={{fontSize:10,color:"#a78b5e",fontStyle:"italic"}}>custom</span>}
                    </div>
                    {isEditing?(
                      <EditRunInline defaultVal={displayDesc}
                        onSave={t=>saveCustomRun(key,t)}
                        onCancel={()=>setEditingRun(null)}
                        onReset={()=>resetCustomRun(key)}/>
                    ):(
                      <div style={{fontSize:13,color:done?"#6a8a70":"#e8dcc8",lineHeight:1.5,marginBottom:6}}>{displayDesc}</div>
                    )}
                    {/* Per-run notes */}
                    {!isEditing&&(
                      <textarea value={note} onChange={e=>saveRunNote(key,e.target.value)}
                        placeholder="Notes — how it felt, time, distance, any issues..."
                        style={{...IS,resize:"none",height:56,fontSize:12,marginTop:4}}/>
                    )}
                  </div>
                  {!isEditing&&(
                    <button onClick={()=>setEditingRun(key)} style={{background:"none",border:"none",cursor:"pointer",color:"#6a5030",fontSize:14,padding:"0 2px",flexShrink:0}}>✎</button>
                  )}
                </div>
              </div>
            );
          })}
          <div style={{marginTop:24}}>
            <div style={{fontSize:10,letterSpacing:4,textTransform:"uppercase",color:"#4a3820",marginBottom:10}}>All Weeks</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {Array.from({length:12},(_,i)=>{
                const w=i+1;
                const wr=TRAINING_PLAN.filter(r=>r.week===w);
                const done=wr.filter(r=>completedRuns[`w${r.week}-r${r.run}`]).length;
                const pct=done/wr.length;
                return(
                  <button key={w} className="btn" onClick={()=>setTrainingWeek(w)} style={{
                    width:"calc(25% - 4px)",padding:"8px 0",borderRadius:8,cursor:"pointer",textAlign:"center",
                    border:trainingWeek===w?"1.5px solid #c9a96e":"1px solid rgba(255,255,255,0.07)",
                    background:trainingWeek===w?"rgba(201,169,110,0.1)":"rgba(255,255,255,0.02)",
                  }}>
                    <div style={{fontSize:10,color:trainingWeek===w?"#c9a96e":"#4a3820",marginBottom:3}}>Wk {w}</div>
                    <div style={{fontSize:11,fontWeight:700,color:pct===1?"#4caf82":pct>0?"#f0a500":"#2a1f10"}}>{done}/{wr.length}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </>}

        {/* ══ WEEKLY ═════════════════════════════════════════════════════════ */}
        {tab==="Weekly"&&<>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,marginBottom:16}}>Week {currentWeek} Review</div>
          <div style={{display:"flex",gap:4,marginBottom:16}}>
            {days.map((d,i)=>{
              const sc=calcDayScore(d);
              const hasData=Object.values(d.meals).some(m=>m.aiGrade!=null);
              const col=hasData?scoreLabel(sc).color:"#2a1f10";
              return(
                <div key={i} style={{flex:1,background:col+"18",border:`1px solid ${col}44`,borderRadius:8,padding:"8px 3px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:"#4a3820",marginBottom:3}}>{DAYS_SHORT[i]}</div>
                  <div style={{fontSize:13,fontWeight:700,color:col}}>{hasData?sc:"—"}</div>
                  {d.selfScore&&<div style={{fontSize:9,color:"#6a5030",marginTop:2}}>😊{d.selfScore}</div>}
                </div>
              );
            })}
          </div>
          <div style={{padding:"14px 16px",background:"rgba(201,169,110,0.07)",border:"1px solid rgba(201,169,110,0.2)",borderRadius:10,marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,color:"#a78b5e"}}>Full week score</span>
              <span style={{fontSize:22,fontWeight:700,color:weekPct>=75?"#4caf82":weekPct>=55?"#f0a500":"#e05c5c"}}>{weekPct}%</span>
            </div>
            <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${weekPct}%`,background:weekPct>=75?"#4caf82":weekPct>=55?"#f0a500":"#e05c5c",borderRadius:2}}/>
            </div>
          </div>
          <Sec label="Habit Summary">
            {HABITS.map(h=>{
              const vals=days.filter(d=>d.habits[h.key]!==null).map(d=>d.habits[h.key]);
              if(!vals.length) return null;
              const pos=h.bad?vals.filter(v=>!v).length:vals.filter(v=>v).length;
              const pct=Math.round(pos/vals.length*100);
              const col=pct>=75?"#4caf82":pct>=50?"#f0a500":"#e05c5c";
              return(
                <div key={h.key} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:"#a09070"}}>{h.icon} {h.label}</span>
                    <span style={{fontSize:12,fontWeight:700,color:col}}>{pct}%</span>
                  </div>
                  <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:2}}/>
                  </div>
                </div>
              );
            })}
          </Sec>
          <Sec label="Alcohol This Week">
            <div style={{display:"flex",gap:4}}>
              {days.map((d,i)=>{
                const opt=ALCOHOL_OPTIONS.find(o=>o.key===d.alcohol);
                return(
                  <div key={i} style={{flex:1,textAlign:"center",padding:"6px 2px",background:"rgba(255,255,255,0.02)",border:`1px solid ${opt?opt.color+"44":"rgba(255,255,255,0.06)"}`,borderRadius:7}}>
                    <div style={{fontSize:8,color:"#4a3820",marginBottom:2}}>{DAYS_SHORT[i]}</div>
                    <div style={{fontSize:10,fontWeight:700,color:opt?opt.color:"#2a1f10"}}>{opt?opt.label:"—"}</div>
                  </div>
                );
              })}
            </div>
          </Sec>
          <Sec label="Meals This Week">
            {days.map((d,i)=>{
              const hasAny=Object.values(d.meals).some(m=>m.text);
              if(!hasAny) return null;
              return(
                <div key={i} style={{marginBottom:10,padding:"10px 12px",background:"rgba(255,255,255,0.02)",borderRadius:8,borderLeft:"2px solid rgba(167,139,94,0.4)"}}>
                  <div style={{fontSize:10,color:"#a78b5e",marginBottom:6,letterSpacing:2}}>{DAYS_SHORT[i].toUpperCase()}</div>
                  {MEALS.map(meal=>{
                    const m=d.meals[meal];
                    if(!m.text) return null;
                    return(
                      <div key={meal} style={{marginBottom:5}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <span style={{fontSize:12,color:"#7a6a50",flex:1}}>{meal}: <span style={{color:"#a09070"}}>{m.text}</span></span>
                          <div style={{display:"flex",gap:8,flexShrink:0,marginLeft:8}}>
                            {m.selfGrade!=null&&<span style={{fontSize:10,color:"#6a5030"}}>You:{m.selfGrade}/3</span>}
                            {m.aiGrade!=null&&<span style={{fontSize:10,fontWeight:700,color:gradeColor(m.aiGrade)}}>{m.aiEmoji} AI:{gradeLabel(m.aiGrade)}</span>}
                          </div>
                        </div>
                        {m.aiFeedback&&<div style={{fontSize:11,color:"#6a5030",fontStyle:"italic",marginTop:2}}>{m.aiFeedback}</div>}
                      </div>
                    );
                  })}
                  {(d.snacks||[]).filter(s=>s.text).map((sn,si)=>(
                    <div key={si} style={{fontSize:11,color:"#7a6a50",marginTop:4}}>
                      Snack: {sn.text}
                      {sn.aiGrade&&<span style={{marginLeft:6,fontWeight:700,color:sn.aiGrade==="good"?"#4caf82":sn.aiGrade==="bad"?"#e05c5c":"#f0a500"}}>{sn.aiEmoji} {sn.aiGrade}</span>}
                      {sn.reason&&<span style={{color:"#4a3820",marginLeft:4}}>· {sn.reason}</span>}
                    </div>
                  ))}
                </div>
              );
            })}
          </Sec>
          {days.some(d=>d.sleep?.hours)&&(
            <Sec label="Sleep">
              {days.map((d,i)=>d.sleep?.hours?(
                <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:12,color:"#6a5a45"}}>{DAYS_SHORT[i]}</span>
                  <span style={{fontSize:12,color:"#a09070"}}>
                    {d.sleep.hours}h
                    {d.sleep.quality&&<span style={{marginLeft:6,fontWeight:700,color:d.sleep.quality==="great"?"#4caf82":d.sleep.quality==="okay"?"#f0a500":"#e05c5c"}}>· {d.sleep.quality}</span>}
                    {d.caffeine>=3&&<span style={{marginLeft:6,fontSize:10,color:"#f0a500"}}>☕×{d.caffeine}</span>}
                  </span>
                </div>
              ):null)}
            </Sec>
          )}
          {days.some(d=>d.selfNote)&&(
            <Sec label="Reflections">
              {days.map((d,i)=>d.selfNote?(
                <div key={i} style={{marginBottom:10,padding:"10px 12px",background:"rgba(255,255,255,0.02)",borderRadius:8,borderLeft:"2px solid #a78b5e"}}>
                  <div style={{fontSize:10,color:"#a78b5e",marginBottom:4}}>{DAYS_SHORT[i]}{d.selfScore?` · ${d.selfScore}/10`:""}</div>
                  <div style={{fontSize:13,color:"#a09070",lineHeight:1.6}}>{d.selfNote}</div>
                </div>
              ):null)}
            </Sec>
          )}
          <button onClick={()=>setShowCloseWeek(true)} style={{
            width:"100%",padding:"14px",borderRadius:10,cursor:"pointer",marginTop:8,
            background:"linear-gradient(135deg,#9a7a40,#c9a96e)",border:"none",
            color:"#0e0c06",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
          }}>Close Week & Archive →</button>
          {showCloseWeek&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:24}}>
              <div style={{background:"#1a1208",border:"1px solid rgba(201,169,110,0.3)",borderRadius:16,padding:24,width:"100%",maxWidth:380}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,marginBottom:6}}>Close Week {currentWeek}?</div>
                <div style={{fontSize:13,color:"#6a5030",marginBottom:20}}>Archives this week and starts Week {currentWeek+1}. All data saved.</div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={()=>setShowCloseWeek(false)} style={{flex:1,padding:"12px",borderRadius:9,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#a09070",fontSize:13}}>Cancel</button>
                  <button onClick={closeWeek} style={{flex:2,padding:"12px",borderRadius:9,cursor:"pointer",border:"none",background:"linear-gradient(135deg,#9a7a40,#c9a96e)",color:"#0e0c06",fontSize:13,fontWeight:700}}>Archive & Start Week {currentWeek+1}</button>
                </div>
              </div>
            </div>
          )}
        </>}

        {/* ══ HISTORY ════════════════════════════════════════════════════════ */}
        {tab==="History"&&<>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,marginBottom:16}}>Past Weeks</div>
          {pastWeeks.length===0?(
            <div style={{textAlign:"center",padding:"40px 20px",color:"#4a3820"}}>
              <div style={{fontSize:32,marginBottom:10}}>📖</div>
              <div style={{fontSize:14}}>No archived weeks yet.<br/>Close your first week to see history.</div>
            </div>
          ):[...pastWeeks].reverse().map(pw=>(
            <div key={pw.week} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"16px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontFamily:"'DM Serif Display',serif",fontSize:18}}>Week {pw.week}</span>
                <span style={{fontSize:22,fontWeight:700,color:pw.report.pct>=75?"#4caf82":pw.report.pct>=55?"#f0a500":"#e05c5c"}}>{pw.report.pct}%</span>
              </div>
              <div style={{display:"flex",gap:4,marginBottom:10}}>
                {pw.days.map((d,i)=>{
                  const sc=calcDayScore(d);
                  const col=scoreLabel(sc).color;
                  return(
                    <div key={i} style={{flex:1,background:col+"18",border:`1px solid ${col}33`,borderRadius:6,padding:"5px 2px",textAlign:"center"}}>
                      <div style={{fontSize:8,color:"#4a3820"}}>{DAYS_SHORT[i]}</div>
                      <div style={{fontSize:11,fontWeight:700,color:col}}>{sc}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
                {pw.report.avgSelf&&<span style={{fontSize:12,color:"#6a5030"}}>Feel: <b style={{color:"#c9a96e"}}>{pw.report.avgSelf}/10</b></span>}
                {pw.report.avgSleep&&<span style={{fontSize:12,color:"#6a5030"}}>Sleep: <b style={{color:"#c9a96e"}}>{pw.report.avgSleep}h</b></span>}
                {pw.report.avgScreen&&<span style={{fontSize:12,color:"#6a5030"}}>Screen: <b style={{color:"#c9a96e"}}>{pw.report.avgScreen}h/day</b></span>}
              </div>
            </div>
          ))}
        </>}

      </div>
    </div>
  );
}

// ── SHARED ────────────────────────────────────────────────────────────────────
const IS = { width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"10px 13px", color:"#e8dcc8", fontSize:13, outline:"none" };

function Sec({label,children}) {
  return(
    <div style={{marginBottom:22}}>
      <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"#a78b5e",marginBottom:10}}>{label}</div>
      {children}
    </div>
  );
}

function MealCard({meal,data,onTextChange,onSelfGrade,onCalories,onGrade}) {
  const hasAI = data.aiGrade!=null;
  const bCol = hasAI ? gradeColor(data.aiGrade) : "rgba(255,255,255,0.07)";
  const guide = CALORIE_GUIDE[meal];
  return(
    <div style={{marginBottom:12,padding:"13px",background:"rgba(255,255,255,0.02)",border:`1px solid ${bCol}44`,borderRadius:10}}>
      <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"#a78b5e",marginBottom:8}}>{meal}</div>
      <div style={{display:"flex",gap:7,marginBottom:8}}>
        <input value={data.text} onChange={e=>onTextChange(e.target.value)}
          placeholder={`What did you have for ${meal.toLowerCase()}?`}
          style={{...IS,flex:1,padding:"9px 11px"}}/>
        <button className="btn" onClick={onGrade} disabled={!data.text.trim()||data.grading} style={{
          padding:"9px 12px",borderRadius:8,cursor:data.text.trim()?"pointer":"default",
          border:"1px solid rgba(201,169,110,0.4)",background:"rgba(201,169,110,0.1)",
          color:"#c9a96e",fontSize:11,fontWeight:700,whiteSpace:"nowrap",
          opacity:data.text.trim()?1:0.4,
        }}>{data.grading?"...":"Grade"}</button>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:hasAI?8:0}}>
        <div style={{flex:1}}>
          <div style={{fontSize:9,color:"#6a5030",marginBottom:4,letterSpacing:1}}>SELF GRADE</div>
          <div style={{display:"flex",gap:4}}>
            {[0,1,2,3].map(n=>(
              <button key={n} className="btn" onClick={()=>onSelfGrade(n)} style={{
                flex:1,padding:"5px 0",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,
                border:data.selfGrade===n?`1.5px solid ${gradeColor(n)}`:"1px solid rgba(255,255,255,0.08)",
                background:data.selfGrade===n?gradeColor(n)+"22":"rgba(255,255,255,0.02)",
                color:data.selfGrade===n?gradeColor(n):"#4a3820",
              }}>{n}</button>
            ))}
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:9,color:"#6a5030",marginBottom:4,letterSpacing:1}}>CALORIES</div>
          <div style={{display:"flex",gap:4}}>
            {["light","medium","heavy"].map(c=>(
              <button key={c} className="btn" onClick={()=>onCalories(c)} style={{
                flex:1,padding:"5px 0",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,
                border:data.calories===c?`1.5px solid ${CALORIE_COLORS[c]}`:"1px solid rgba(255,255,255,0.08)",
                background:data.calories===c?CALORIE_COLORS[c]+"22":"rgba(255,255,255,0.02)",
                color:data.calories===c?CALORIE_COLORS[c]:"#4a3820",
                textTransform:"capitalize",
              }}>{c[0].toUpperCase()+c.slice(1)}</button>
            ))}
          </div>
          {data.calories&&<div style={{fontSize:9,color:"#6a5030",marginTop:4,textAlign:"center"}}>{guide[data.calories]}</div>}
        </div>
      </div>
      {hasAI&&(
        <div style={{background:gradeColor(data.aiGrade)+"11",border:`1px solid ${gradeColor(data.aiGrade)}33`,borderRadius:8,padding:"10px 12px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>{data.aiEmoji}</span>
              <span style={{fontSize:13,fontWeight:700,color:gradeColor(data.aiGrade)}}>AI: {gradeLabel(data.aiGrade)} ({data.aiGrade}/3)</span>
            </div>
            {data.selfGrade!=null&&(
              <span style={{fontSize:11,color:data.selfGrade===data.aiGrade?"#4caf82":"#f0a500"}}>
                You: {data.selfGrade}/3 {data.selfGrade===data.aiGrade?"✓":"↕"}
              </span>
            )}
          </div>
          <div style={{fontSize:12,color:"#a09070"}}>{data.aiFeedback}</div>
          <div style={{display:"flex",gap:12,marginTop:6}}>
            {data.aiProtein&&<span style={{fontSize:10,color:"#6a5030"}}>Protein: <b style={{color:"#c9a96e"}}>{data.aiProtein}</b></span>}
            {data.aiConcern&&<span style={{fontSize:10,color:"#e05c5c"}}>⚠ {data.aiConcern}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function SnackCard({snack,onUpdate,onGrade,onRemove}) {
  const hasAI = snack.aiGrade!=null;
  const col = snack.aiGrade==="good"?"#4caf82":snack.aiGrade==="bad"?"#e05c5c":"#f0a500";
  return(
    <div style={{marginBottom:10,padding:"12px 13px",background:"rgba(255,255,255,0.02)",border:`1px solid ${hasAI?col+"44":"rgba(255,255,255,0.07)"}`,borderRadius:10}}>
      <div style={{display:"flex",gap:7,marginBottom:8}}>
        <input value={snack.text} onChange={e=>onUpdate({text:e.target.value,aiGrade:null,aiFeedback:null,aiEmoji:null})}
          placeholder="What did you snack on?" style={{...IS,flex:1,padding:"8px 11px"}}/>
        <button className="btn" onClick={onGrade} disabled={!snack.text.trim()||snack.grading} style={{
          padding:"8px 10px",borderRadius:8,cursor:snack.text.trim()?"pointer":"default",
          border:"1px solid rgba(201,169,110,0.4)",background:"rgba(201,169,110,0.1)",
          color:"#c9a96e",fontSize:11,fontWeight:700,opacity:snack.text.trim()?1:0.4,
        }}>{snack.grading?"...":"Grade"}</button>
        <button onClick={onRemove} style={{background:"none",border:"none",cursor:"pointer",color:"#4a2020",fontSize:16,padding:"0 4px"}}>×</button>
      </div>
      <div style={{display:"flex",gap:5,marginBottom:7}}>
        {SNACK_RATINGS.map(r=>(
          <button key={r.key} className="btn" onClick={()=>onUpdate({selfRating:r.key})} style={{
            flex:1,padding:"5px 4px",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,
            border:snack.selfRating===r.key?`1.5px solid ${r.color}`:"1px solid rgba(255,255,255,0.08)",
            background:snack.selfRating===r.key?r.color+"22":"rgba(255,255,255,0.02)",
            color:snack.selfRating===r.key?r.color:"#4a3820",
          }}>{r.icon} {r.label}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:hasAI?8:0}}>
        {SNACK_REASONS.map(r=>(
          <button key={r} className="btn" onClick={()=>onUpdate({reason:r})} style={{
            padding:"4px 8px",borderRadius:5,cursor:"pointer",fontSize:10,
            border:snack.reason===r?"1.5px solid #c9a96e":"1px solid rgba(255,255,255,0.08)",
            background:snack.reason===r?"rgba(201,169,110,0.15)":"transparent",
            color:snack.reason===r?"#c9a96e":"#4a3820",
          }}>{r}</button>
        ))}
      </div>
      {hasAI&&(
        <div style={{padding:"8px 10px",background:col+"11",border:`1px solid ${col}33`,borderRadius:7,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>{snack.aiEmoji}</span>
          <div>
            <span style={{fontSize:12,fontWeight:700,color:col}}>AI: {snack.aiGrade}</span>
            {snack.selfRating&&snack.aiGrade!==snack.selfRating&&<span style={{fontSize:10,color:"#f0a500",marginLeft:8}}>↕ you said {snack.selfRating}</span>}
            <div style={{fontSize:11,color:"#a09070"}}>{snack.aiFeedback}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditRunInline({defaultVal,onSave,onCancel,onReset}) {
  const [val,setVal] = useState(defaultVal);
  return(
    <div style={{marginTop:6}}>
      <textarea value={val} onChange={e=>setVal(e.target.value)}
        style={{...IS,resize:"none",height:60,fontSize:12,marginBottom:6}}/>
      <div style={{display:"flex",gap:6}}>
        <button onClick={onCancel} style={{flex:1,padding:"6px",borderRadius:6,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#6a5030",fontSize:11}}>Cancel</button>
        <button onClick={onReset} style={{flex:1,padding:"6px",borderRadius:6,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#6a5030",fontSize:11}}>Reset to original</button>
        <button onClick={()=>onSave(val)} style={{flex:2,padding:"6px",borderRadius:6,cursor:"pointer",border:"none",background:"#c9a96e",color:"#0e0c06",fontSize:11,fontWeight:700}}>Save</button>
      </div>
    </div>
  );
}

function GoalCard({goal,onEdit,onDelete,onToggle}) {
  const is5K = goal.lowerIsBetter && goal.progress!=null;
  let pct = 0;
  if (goal.lowerIsBetter) {
    if (goal.progress==null) pct = 0;
    else pct = Math.max(0,Math.min(100,Math.round((1-(goal.progress-goal.target)/Math.max(goal.target*0.3,1))*100)));
  } else {
    pct = Math.min(100,Math.round((goal.progress/goal.target)*100));
  }
  if (isNaN(pct)) pct=0;
  const col = goal.completed?"#4caf82":pct>=75?"#4caf82":pct>=40?"#f0a500":"#e05c5c";
  return(
    <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${goal.completed?"#4caf8233":"rgba(255,255,255,0.08)"}`,borderRadius:11,padding:"14px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
            <button onClick={onToggle} style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${goal.completed?"#4caf82":"rgba(255,255,255,0.2)"}`,background:goal.completed?"#4caf82":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#0d0b08",flexShrink:0}}>
              {goal.completed&&"✓"}
            </button>
            <span style={{fontSize:14,fontWeight:500,color:goal.completed?"#6a8a70":"#e8dcc8",textDecoration:goal.completed?"line-through":"none"}}>{goal.title}</span>
          </div>
          {goal.desc&&<div style={{fontSize:12,color:"#6a5030",marginLeft:26}}>{goal.desc}</div>}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={onEdit} style={{background:"none",border:"none",cursor:"pointer",color:"#6a5030",fontSize:14}}>✎</button>
          <button onClick={onDelete} style={{background:"none",border:"none",cursor:"pointer",color:"#4a2020",fontSize:14}}>×</button>
        </div>
      </div>
      <div style={{marginLeft:26}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6a5030",marginBottom:4}}>
          <span>{goal.lowerIsBetter?goal.progress!=null?`${goal.progress} min → target ${goal.target}:00`:"No time logged yet":`${goal.progress} / ${goal.target} ${goal.unit}`}</span>
          {goal.progress!=null&&<span style={{color:col,fontWeight:700}}>{pct}%</span>}
        </div>
        <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:2,transition:"width 0.4s"}}/>
        </div>
      </div>
    </div>
  );
}

function GoalEditor({goal,onChange,onSave,onCancel,isNew}) {
  return(
    <div style={{background:"rgba(201,169,110,0.07)",border:"1px solid rgba(201,169,110,0.25)",borderRadius:11,padding:"14px",marginBottom:10}}>
      <div style={{fontSize:10,letterSpacing:2,color:"#a78b5e",marginBottom:10}}>{isNew?"NEW GOAL":"EDIT GOAL"}</div>
      {[["title","Goal title"],["desc","Description (optional)"]].map(([k,ph])=>(
        <input key={k} value={goal[k]} onChange={e=>onChange({...goal,[k]:e.target.value})}
          placeholder={ph} style={{...IS,marginBottom:8}}/>
      ))}
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input type="number" value={goal.progress??""} onChange={e=>onChange({...goal,progress:parseFloat(e.target.value)||0})} placeholder="Current" style={{...IS,flex:1}}/>
        <input type="number" value={goal.target} onChange={e=>onChange({...goal,target:parseFloat(e.target.value)||100})} placeholder="Target" style={{...IS,flex:1}}/>
        <input value={goal.unit} onChange={e=>onChange({...goal,unit:e.target.value})} placeholder="Unit" style={{...IS,flex:1}}/>
      </div>
      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#8a7060",marginBottom:12,cursor:"pointer"}}>
        <input type="checkbox" checked={!!goal.lowerIsBetter} onChange={e=>onChange({...goal,lowerIsBetter:e.target.checked})}/>
        Lower is better (e.g. time, weight)
      </label>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onCancel} style={{flex:1,padding:"9px",borderRadius:7,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#8a7060",fontSize:12}}>Cancel</button>
        <button onClick={onSave} style={{flex:2,padding:"9px",borderRadius:7,cursor:"pointer",border:"none",background:"#c9a96e",color:"#0e0c06",fontSize:12,fontWeight:700}}>Save Goal</button>
      </div>
    </div>
  );
}

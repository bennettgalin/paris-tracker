import { useState, useEffect, useRef } from "react";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const TABS = ["Today", "Goals", "Running", "Weekly", "History"];

const HABITS = [
  { key: "pastry",    label: "Had a pastry",          bad: true,  icon: "🥐" },
  { key: "seconds",   label: "Took seconds",           bad: true,  icon: "🍽️" },
  { key: "dessert",   label: "Had dessert",            bad: true,  icon: "🍮" },
  { key: "dietSoda",  label: "Had diet soda",          bad: true,  icon: "🥤" },
  { key: "alcohol",   label: "Drank alcohol",          bad: true,  icon: "🍷" },
  { key: "ran",       label: "Went for a run",         bad: false, icon: "🏃" },
  { key: "walkedLot", label: "Walked 15k+ steps",      bad: false, icon: "👟" },
  { key: "noSnacks",  label: "No snacking",            bad: false, icon: "✅" },
];

const DAY_MAX = 14; // 3 meals up to 3pts each + 5 bonus pts
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ── YOUR RUNNING PLAN ─────────────────────────────────────────────────────────
const TRAINING_PLAN = [
  { week: 1,  run: 1, desc: "4.5 mile run @ 8:30 w/ strides at top and bottom of Champ de Mars" },
  { week: 1,  run: 2, desc: "Walk" },
  { week: 1,  run: 3, desc: "10 min WU @ 9:15 — 15 min @ 7:25 — 10 min CD @ 9:15" },
  { week: 1,  run: 4, desc: "3–4 Miles Easy Run (optional)", optional: true },
  { week: 2,  run: 1, desc: "4 miles easy + strides every mile" },
  { week: 2,  run: 2, desc: "1m WU @ 9:00 — 2 miles tempo @ 7:50 — 1m CD @ 9:00" },
  { week: 2,  run: 3, desc: "5–6 miles easy (8:20–8:50)" },
  { week: 2,  run: 4, desc: "4 miles easy (optional)", optional: true },
  { week: 3,  run: 1, desc: "4 miles reverse split (8:30, 8:15, 8:00, 7:45)" },
  { week: 3,  run: 2, desc: "1m WU @ 9:00 — 8 min @ 7:50 — 3 min @ 9:15 — 8 min @ 7:50 — 1m CD @ 8:45" },
  { week: 3,  run: 3, desc: "5 miles easy (8:20–8:50)" },
  { week: 3,  run: 4, desc: "4 miles easy (optional)", optional: true },
  { week: 4,  run: 1, desc: "4–5 miles easy (8:10–8:30)" },
  { week: 4,  run: 2, desc: "25 minutes at 8:00/mile" },
  { week: 4,  run: 3, desc: "5 miles easy (8:20–8:50)" },
  { week: 4,  run: 4, desc: "3 miles easy (optional)", optional: true },
  { week: 5,  run: 1, desc: "4 miles easy + strides every ½ mile" },
  { week: 5,  run: 2, desc: "1m WU @ 8:50 — 2 miles tempo @ 7:45 — 1m CD @ 8:50" },
  { week: 5,  run: 3, desc: "6 miles easy (8:30–9:00)" },
  { week: 5,  run: 4, desc: "3 miles easy (optional)", optional: true },
  { week: 6,  run: 1, desc: "4 miles reverse split (8:30, 8:15, 8:00, 7:45)" },
  { week: 6,  run: 2, desc: "5 min WU @ 9:00 — 1m @ 7:50 — 5 min @ 9:00 — 1m @ 7:45 — 10 min @ 8:45" },
  { week: 6,  run: 3, desc: "5 miles easy (8:30–9:00)" },
  { week: 6,  run: 4, desc: "4 miles easy (optional)", optional: true },
  { week: 7,  run: 1, desc: "4 miles easy + strides every ½ mile" },
  { week: 7,  run: 2, desc: "5K at 7:50/mile" },
  { week: 7,  run: 3, desc: "6 miles easy (8:30–9:00)" },
  { week: 7,  run: 4, desc: "4 miles easy (optional)", optional: true },
  { week: 8,  run: 1, desc: "4 miles reverse split (8:20, 8:05, 7:50, 7:35)" },
  { week: 8,  run: 2, desc: "5 min WU @ 8:45 — 20 min @ 7:45 — 5 min CD @ 8:45" },
  { week: 8,  run: 3, desc: "5 miles easy (8:20–8:50)" },
  { week: 8,  run: 4, desc: "3 miles easy (optional)", optional: true },
  { week: 9,  run: 1, desc: "4–5 miles easy (8:10–8:30)" },
  { week: 9,  run: 2, desc: "5 min WU @ 8:45 — 3 × 1 mile @ 7:30 w/ 2 min rest @ 9:15 — 5 min CD @ 8:45" },
  { week: 9,  run: 3, desc: "4–5 miles easy (8:10–8:30)" },
  { week: 9,  run: 4, desc: "3 miles easy (optional)", optional: true },
  { week: 10, run: 1, desc: "4 miles easy + strides every ½ mile" },
  { week: 10, run: 2, desc: "1m WU @ 9:00 — 2 miles tempo @ 7:45 — 1m CD @ 9:00" },
  { week: 10, run: 3, desc: "7 miles very easy (8:45–9:15)" },
  { week: 10, run: 4, desc: "3 miles easy (optional)", optional: true },
  { week: 11, run: 1, desc: "4 miles reverse split (8:15, 8:00, 7:45, 7:30)" },
  { week: 11, run: 2, desc: "5K at 7:45/mile" },
  { week: 11, run: 3, desc: "5 miles easy (8:20–8:50)" },
  { week: 12, run: 1, desc: "4 miles easy + strides every ½ mile" },
  { week: 12, run: 2, desc: "5 min WU @ 8:45 — 4 × 1 mile @ 7:30 w/ 2 min rest @ 9:15 — 5 min CD @ 8:45" },
  { week: 12, run: 3, desc: "🏁 5K Time Trial — Sub-20 Goal" },
];

const RUN_TYPE_COLOR = {
  "easy": "#4a9eff", "tempo": "#f0a500", "interval": "#e05c5c",
  "long": "#4caf82", "race": "#c9a96e", "walk": "#8bc34a", "trial": "#c9a96e"
};

function getRunType(desc) {
  const d = desc.toLowerCase();
  if (d.includes("time trial") || d.includes("🏁")) return "trial";
  if (d.includes("5k at")) return "race";
  if (d.includes("tempo") || d.includes("×") || d.includes("x 1 mile")) return "interval";
  if (d.includes("reverse split") || d.includes("wu") || d.includes("wd")) return "tempo";
  if (d === "walk") return "walk";
  return "easy";
}

const defaultGoals = [
  { id: 1, type: "big",    title: "Under 175 lbs by May 15",    desc: "Return to the US lighter and leaner", progress: 0, target: 100, unit: "%",   completed: false, lowerIsBetter: false },
  { id: 2, type: "big",    title: "Sub-20 minute 5K",           desc: "12-week plan ending May 2026",        progress: 22, target: 20, unit: "min", completed: false, lowerIsBetter: true  },
  { id: 3, type: "big",    title: "Feel great about how I look & feel", desc: "General wellbeing and confidence", progress: 0, target: 100, unit: "%", completed: false, lowerIsBetter: false },
  { id: 4, type: "weekly", title: "No diet soda this week",     desc: "", progress: 0, target: 7, unit: "days", completed: false, lowerIsBetter: false },
  { id: 5, type: "weekly", title: "Run 3× this week",           desc: "", progress: 0, target: 3, unit: "runs", completed: false, lowerIsBetter: false },
  { id: 6, type: "weekly", title: "No pastries Mon–Fri",        desc: "", progress: 0, target: 5, unit: "days", completed: false, lowerIsBetter: false },
];

const emptyDay = () => ({
  meals: {
    Breakfast: { text: "", grade: null, grading: false },
    Lunch:     { text: "", grade: null, grading: false },
    Dinner:    { text: "", grade: null, grading: false },
  },
  habits: { pastry: null, seconds: null, dessert: null, dietSoda: null, alcohol: null, ran: null, walkedLot: null, noSnacks: null },
  runNote: "", screenTime: "", selfScore: null, selfNote: "",
});

function calcDayScore(d) {
  let s = 0;
  ["Breakfast", "Lunch", "Dinner"].forEach(m => {
    const g = d.meals[m]?.grade;
    if (g !== null && g !== undefined) s += g;
  });
  if (d.habits.noSnacks)  s += 2;
  if (d.habits.ran)       s += 1;
  if (!d.habits.alcohol)  s += 1;
  if (d.habits.walkedLot) s += 1;
  return s;
}

function scoreLabel(score) {
  const p = score / DAY_MAX;
  if (p >= 0.85) return { text: "Excellent", color: "#4caf82" };
  if (p >= 0.65) return { text: "Good",      color: "#8bc34a" };
  if (p >= 0.45) return { text: "Fair",      color: "#f0a500" };
  return              { text: "Tough day",  color: "#e05c5c" };
}

function gradeColor(g) {
  if (g === null || g === undefined) return "#4a3820";
  if (g >= 3) return "#4caf82";
  if (g >= 2) return "#f0a500";
  return "#e05c5c";
}
function gradeLabel(g) {
  if (g === null || g === undefined) return "";
  if (g >= 3) return "Great";
  if (g >= 2) return "Fair";
  return "Poor";
}

// ── STORAGE ───────────────────────────────────────────────────────────────────
function loadState() {
  try { const r = localStorage.getItem("paris_v3"); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem("paris_v3", JSON.stringify(s)); } catch {}
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const saved = loadState();
  const [tab, setTab]                   = useState("Today");
  const [currentWeek, setCurrentWeek]   = useState(saved?.currentWeek ?? 1);
  const [days, setDays]                 = useState(saved?.days ?? DAYS_SHORT.map(() => emptyDay()));
  const [activeDay, setActiveDay]       = useState(() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; });
  const [pastWeeks, setPastWeeks]       = useState(saved?.pastWeeks ?? []);
  const [goals, setGoals]               = useState(saved?.goals ?? defaultGoals);
  const [trainingWeek, setTrainingWeek] = useState(saved?.trainingWeek ?? 1);
  const [completedRuns, setCompletedRuns] = useState(saved?.completedRuns ?? []);
  const [editingGoal, setEditingGoal]   = useState(null);
  const [newGoalForm, setNewGoalForm]   = useState(null);
  const [showCloseWeek, setShowCloseWeek] = useState(false);

  useEffect(() => {
    saveState({ currentWeek, days, pastWeeks, goals, trainingWeek, completedRuns });
  }, [currentWeek, days, pastWeeks, goals, trainingWeek, completedRuns]);

  const day = days[activeDay];
  const isWeekend = activeDay >= 5;
  const todayScore = calcDayScore(day);
  const todayLabel = scoreLabel(todayScore);

  function updateDay(patch) {
    setDays(prev => { const n = [...prev]; n[activeDay] = { ...prev[activeDay], ...patch }; return n; });
  }
  function setHabit(key, val) { updateDay({ habits: { ...day.habits, [key]: val } }); }

  // ── AI meal grading
  async function gradeMeal(mealName) {
    const text = day.meals[mealName].text.trim();
    if (!text) return;
    // set grading spinner
    setDays(prev => {
      const n = [...prev];
      n[activeDay] = { ...prev[activeDay], meals: { ...prev[activeDay].meals, [mealName]: { ...prev[activeDay].meals[mealName], grading: true } } };
      return n;
    });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          system: `You are a nutrition coach helping a 19-year-old college student studying abroad in Paris who is trying to lose weight (goal: under 175 lbs by May 15) and run a sub-20 min 5K. He eats with a French host mother for dinner. Evaluate meals for ${mealName}.

Respond ONLY with valid JSON, no markdown, no explanation:
{"grade": <0|1|2|3>, "feedback": "<one short sentence>", "emoji": "<single emoji>"}

Grading scale:
3 = Excellent: light, nutritious, appropriate portions (e.g. yogurt, salad, grilled protein, soup)
2 = Fair: reasonable but could be lighter (e.g. sandwich, pasta small portion, one serving of a heavier dish)
1 = Poor: heavy, high-calorie, or indulgent (e.g. burger, large pasta, fried food, pizza)
0 = Very poor: pastry, fast food, huge portions, or multiple indulgent items

Be concise and encouraging. Keep feedback under 12 words.`,
          messages: [{ role: "user", content: `I had for ${mealName}: ${text}` }]
        })
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || '{"grade":2,"feedback":"Logged.","emoji":"🍽️"}';
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setDays(prev => {
        const n = [...prev];
        n[activeDay] = { ...prev[activeDay], meals: { ...prev[activeDay].meals, [mealName]: { text, grade: parsed.grade, grading: false, feedback: parsed.feedback, emoji: parsed.emoji } } };
        return n;
      });
    } catch {
      setDays(prev => {
        const n = [...prev];
        n[activeDay] = { ...prev[activeDay], meals: { ...prev[activeDay].meals, [mealName]: { ...prev[activeDay].meals[mealName], grading: false, grade: 2, feedback: "Logged.", emoji: "🍽️" } } };
        return n;
      });
    }
  }

  function updateMealText(mealName, text) {
    setDays(prev => {
      const n = [...prev];
      n[activeDay] = { ...prev[activeDay], meals: { ...prev[activeDay].meals, [mealName]: { ...prev[activeDay].meals[mealName], text, grade: null, feedback: null, emoji: null } } };
      return n;
    });
  }

  // ── week close
  function buildReport() {
    const wd = days.slice(0, 5);
    const total = wd.reduce((s, d) => s + calcDayScore(d), 0);
    const max = 5 * DAY_MAX;
    const habitAvg = {};
    HABITS.forEach(h => {
      const vals = wd.filter(d => d.habits[h.key] !== null).map(d => d.habits[h.key] ? 1 : 0);
      habitAvg[h.key] = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 100) : null;
    });
    const screens = wd.filter(d => d.screenTime).map(d => parseFloat(d.screenTime)).filter(Boolean);
    const selfScores = wd.filter(d => d.selfScore).map(d => d.selfScore);
    return {
      pct: Math.round(total / max * 100), total, max, habitAvg,
      avgScreen: screens.length ? (screens.reduce((a, b) => a + b, 0) / screens.length).toFixed(1) : null,
      avgSelf: selfScores.length ? (selfScores.reduce((a, b) => a + b, 0) / selfScores.length).toFixed(1) : null,
    };
  }

  function closeWeek() {
    setPastWeeks(p => [...p, { week: currentWeek, days: JSON.parse(JSON.stringify(days)), report: buildReport() }]);
    setCurrentWeek(w => w + 1);
    setTrainingWeek(w => Math.min(w + 1, 12));
    setDays(DAYS_SHORT.map(() => emptyDay()));
    setShowCloseWeek(false);
  }

  function toggleRun(key) { setCompletedRuns(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]); }
  function saveGoal(g) { setGoals(p => p.map(x => x.id === g.id ? g : x)); setEditingGoal(null); }
  function addGoal(g) { setGoals(p => [...p, { ...g, id: Date.now() }]); setNewGoalForm(null); }
  function deleteGoal(id) { setGoals(p => p.filter(x => x.id !== id)); }
  function toggleComplete(id) { setGoals(p => p.map(x => x.id === id ? { ...x, completed: !x.completed } : x)); }

  const weekdayScore = days.slice(0, 5).reduce((s, d) => s + calcDayScore(d), 0);
  const weekPct = Math.round(weekdayScore / (5 * DAY_MAX) * 100);
  const weekCol = weekPct >= 75 ? "#4caf82" : weekPct >= 55 ? "#f0a500" : "#e05c5c";

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b08", color: "#e8dcc8", fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; } button, input, textarea { font-family: 'DM Sans', sans-serif; } ::-webkit-scrollbar { width: 0; } .btn { transition: all 0.15s; } .btn:active { transform: scale(0.97); }`}</style>

      {/* Header */}
      <div style={{ padding: "24px 20px 0", background: "linear-gradient(180deg,#1a1208 0%,#0d0b08 100%)", borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#6a5030", textTransform: "uppercase", marginBottom: 4 }}>Paris · Week {currentWeek}</div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, lineHeight: 1.1 }}>Bennett's Tracker</div>
          </div>
          {tab === "Today" && !isWeekend && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: todayLabel.color }}>{todayScore}</div>
              <div style={{ fontSize: 10, color: todayLabel.color, letterSpacing: 1 }}>{todayLabel.text}</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              padding: "10px 0 8px", fontSize: 11, letterSpacing: 1,
              color: tab === t ? "#c9a96e" : "#4a3820",
              borderBottom: tab === t ? "2px solid #c9a96e" : "2px solid transparent",
              fontWeight: tab === t ? 700 : 400,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>

        {/* ═══ TODAY ═══════════════════════════════════════════════════════════ */}
        {tab === "Today" && (
          <>
            {/* Day tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 22 }}>
              {DAYS_SHORT.map((d, i) => {
                const sc = calcDayScore(days[i]);
                const isWE = i >= 5;
                const active = i === activeDay;
                const hasData = Object.values(days[i].meals).some(m => m.grade !== null);
                const col = isWE ? "#a78b5e" : hasData ? scoreLabel(sc).color : "#2a1f10";
                return (
                  <button key={i} onClick={() => setActiveDay(i)} className="btn" style={{
                    flex: 1, padding: "8px 2px", borderRadius: 8, cursor: "pointer", textAlign: "center",
                    border: active ? "1.5px solid #c9a96e" : "1px solid rgba(255,255,255,0.06)",
                    background: active ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.02)",
                  }}>
                    <div style={{ fontSize: 9, color: active ? "#c9a96e" : "#4a3820", marginBottom: 3, letterSpacing: 1 }}>{d}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col }}>{isWE ? "🍷" : hasData ? sc : "·"}</div>
                  </button>
                );
              })}
            </div>

            {isWeekend ? (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>🥂</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, marginBottom: 10 }}>Weekend — enjoy it.</div>
                <div style={{ fontSize: 13, color: "#6a5030", lineHeight: 1.8 }}>You've earned it.<br />Savor every bite. Zero guilt.</div>
              </div>
            ) : (
              <>
                {/* Score bar */}
                <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, marginBottom: 24, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(todayScore / DAY_MAX) * 100}%`, background: todayLabel.color, transition: "width 0.4s", borderRadius: 2 }} />
                </div>

                {/* MEALS */}
                <Sec label="Meals — type what you had, then tap Grade">
                  {["Breakfast", "Lunch", "Dinner"].map(meal => (
                    <MealInput key={meal} meal={meal} data={day.meals[meal]}
                      onChange={text => updateMealText(meal, text)}
                      onGrade={() => gradeMeal(meal)} />
                  ))}
                </Sec>

                {/* HABITS */}
                <Sec label="Daily Habits">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {HABITS.map(h => {
                      const val = day.habits[h.key];
                      const answered = val !== null;
                      const good = h.bad ? val === false : val === true;
                      return (
                        <div key={h.key} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${answered ? (good ? "#4caf8244" : "#e05c5c44") : "rgba(255,255,255,0.07)"}`, borderRadius: 9, padding: "10px 10px 8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                            <span style={{ fontSize: 16 }}>{h.icon}</span>
                            <span style={{ fontSize: 11, color: "#a09070", lineHeight: 1.3 }}>{h.label}</span>
                          </div>
                          <div style={{ display: "flex", gap: 5 }}>
                            {["Yes", "No"].map(opt => {
                              const isYes = opt === "Yes";
                              const sel = val === isYes;
                              const isGood = h.bad ? !isYes : isYes;
                              return (
                                <button key={opt} className="btn" onClick={() => setHabit(h.key, isYes)} style={{
                                  flex: 1, padding: "5px 0", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700,
                                  border: sel ? `1.5px solid ${isGood ? "#4caf82" : "#e05c5c"}` : "1px solid rgba(255,255,255,0.08)",
                                  background: sel ? (isGood ? "#4caf8220" : "#e05c5c20") : "rgba(255,255,255,0.03)",
                                  color: sel ? (isGood ? "#4caf82" : "#e05c5c") : "#4a3820",
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
                {day.habits.ran && (
                  <Sec label="Run Details">
                    <input value={day.runNote} onChange={e => updateDay({ runNote: e.target.value })}
                      placeholder="Distance, time, route, how it felt..."
                      style={inputStyle} />
                  </Sec>
                )}

                {/* SCREEN TIME */}
                <Sec label="Screen Time">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input type="number" value={day.screenTime} onChange={e => updateDay({ screenTime: e.target.value })}
                      placeholder="Hours today" style={{ ...inputStyle, flex: 1 }} />
                    <span style={{ fontSize: 13, color: "#6a5030" }}>hrs</span>
                    {day.screenTime && <span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(day.screenTime) <= 2 ? "#4caf82" : parseFloat(day.screenTime) <= 4 ? "#f0a500" : "#e05c5c" }}>
                      {parseFloat(day.screenTime) <= 2 ? "Great" : parseFloat(day.screenTime) <= 4 ? "Okay" : "High"}
                    </span>}
                  </div>
                </Sec>

                {/* SELF ASSESSMENT */}
                <Sec label="How did today feel? (1–10)">
                  <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <button key={n} className="btn" onClick={() => updateDay({ selfScore: n })} style={{
                        flex: 1, padding: "7px 0", borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 700,
                        border: day.selfScore === n ? "1.5px solid #c9a96e" : "1px solid rgba(255,255,255,0.07)",
                        background: day.selfScore === n ? "rgba(201,169,110,0.2)" : "rgba(255,255,255,0.02)",
                        color: day.selfScore === n ? "#c9a96e" : "#4a3820",
                      }}>{n}</button>
                    ))}
                  </div>
                  <textarea value={day.selfNote} onChange={e => updateDay({ selfNote: e.target.value })}
                    placeholder="Wins, struggles, anything on your mind..."
                    style={{ ...inputStyle, resize: "none", height: 72 }} />
                </Sec>
              </>
            )}
          </>
        )}

        {/* ═══ GOALS ═══════════════════════════════════════════════════════════ */}
        {tab === "Goals" && (
          <>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 6 }}>Your Goals</div>
            <div style={{ fontSize: 12, color: "#6a5030", marginBottom: 20 }}>Track what matters. Edit anytime.</div>
            {["big", "weekly"].map(type => (
              <div key={type} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#a78b5e", marginBottom: 12 }}>
                  {type === "big" ? "Big Goals" : "Weekly Goals"}
                </div>
                {goals.filter(g => g.type === type).map(g =>
                  editingGoal?.id === g.id
                    ? <GoalEditor key={g.id} goal={editingGoal} onChange={setEditingGoal} onSave={() => saveGoal(editingGoal)} onCancel={() => setEditingGoal(null)} />
                    : <GoalCard key={g.id} goal={g} onEdit={() => setEditingGoal({ ...g })} onDelete={() => deleteGoal(g.id)} onToggle={() => toggleComplete(g.id)} />
                )}
                <button onClick={() => setNewGoalForm({ type, title: "", desc: "", progress: 0, target: 100, unit: "%", completed: false, lowerIsBetter: false })} style={{
                  width: "100%", padding: "10px", borderRadius: 9, cursor: "pointer", marginTop: 4,
                  border: "1px dashed rgba(201,169,110,0.3)", background: "transparent", color: "#6a5030", fontSize: 12, letterSpacing: 1,
                }}>+ Add {type === "big" ? "big" : "weekly"} goal</button>
              </div>
            ))}
            {newGoalForm && <GoalEditor goal={newGoalForm} onChange={setNewGoalForm} onSave={() => addGoal(newGoalForm)} onCancel={() => setNewGoalForm(null)} isNew />}
          </>
        )}

        {/* ═══ RUNNING ═════════════════════════════════════════════════════════ */}
        {tab === "Running" && (
          <>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 4 }}>Your 12-Week Plan</div>
            <div style={{ fontSize: 12, color: "#6a5030", marginBottom: 16 }}>Base: ~22 min 5K → Target: Sub-20</div>

            {/* Week selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "12px 14px", background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 10 }}>
              <button className="btn" onClick={() => setTrainingWeek(w => Math.max(1, w - 1))} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#c9a96e", cursor: "pointer", padding: "4px 12px", fontSize: 18 }}>‹</button>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#a78b5e", letterSpacing: 1 }}>TRAINING WEEK</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#c9a96e" }}>{trainingWeek} / 12</div>
              </div>
              <button className="btn" onClick={() => setTrainingWeek(w => Math.min(12, w + 1))} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#c9a96e", cursor: "pointer", padding: "4px 12px", fontSize: 18 }}>›</button>
            </div>

            {/* Overall progress */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6a5030", marginBottom: 5 }}>
                <span>Overall completion</span>
                <span>{completedRuns.length} / {TRAINING_PLAN.length} runs</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(completedRuns.length / TRAINING_PLAN.length) * 100}%`, background: "#c9a96e", borderRadius: 2, transition: "width 0.4s" }} />
              </div>
            </div>

            {/* Runs for selected week */}
            {TRAINING_PLAN.filter(r => r.week === trainingWeek).map(run => {
              const key = `w${run.week}-r${run.run}`;
              const done = completedRuns.includes(key);
              const type = getRunType(run.desc);
              const typeCol = RUN_TYPE_COLOR[type];
              return (
                <div key={key} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 14px", borderRadius: 10, marginBottom: 8, border: `1px solid ${done ? "#4caf8233" : "rgba(255,255,255,0.07)"}`, background: done ? "rgba(76,175,130,0.05)" : "rgba(255,255,255,0.02)" }}>
                  <button className="btn" onClick={() => toggleRun(key)} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${done ? "#4caf82" : "rgba(255,255,255,0.2)"}`, background: done ? "#4caf82" : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0d0b08" }}>
                    {done && "✓"}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#0d0b08", background: typeCol, padding: "2px 8px", borderRadius: 4, letterSpacing: 1, textTransform: "uppercase" }}>{type}</span>
                      <span style={{ fontSize: 11, color: "#6a5030" }}>Run {run.run}{run.optional ? " — optional" : ""}</span>
                    </div>
                    <div style={{ fontSize: 13, color: done ? "#6a8a70" : "#e8dcc8", lineHeight: 1.5 }}>{run.desc}</div>
                  </div>
                </div>
              );
            })}

            {/* Week overview dots */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#4a3820", marginBottom: 10 }}>All Weeks</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const w = i + 1;
                  const wr = TRAINING_PLAN.filter(r => r.week === w);
                  const done = wr.filter(r => completedRuns.includes(`w${r.week}-r${r.run}`)).length;
                  const pct = done / wr.length;
                  return (
                    <button key={w} className="btn" onClick={() => setTrainingWeek(w)} style={{
                      width: "calc(25% - 4px)", padding: "8px 0", borderRadius: 8, cursor: "pointer", textAlign: "center",
                      border: trainingWeek === w ? "1.5px solid #c9a96e" : "1px solid rgba(255,255,255,0.07)",
                      background: trainingWeek === w ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.02)",
                    }}>
                      <div style={{ fontSize: 10, color: trainingWeek === w ? "#c9a96e" : "#4a3820", marginBottom: 3 }}>Wk {w}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: pct === 1 ? "#4caf82" : pct > 0 ? "#f0a500" : "#2a1f10" }}>{done}/{wr.length}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ═══ WEEKLY ══════════════════════════════════════════════════════════ */}
        {tab === "Weekly" && (
          <>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 16 }}>Week {currentWeek} Review</div>

            {/* Day scores */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
              {days.map((d, i) => {
                const sc = calcDayScore(d);
                const isWE = i >= 5;
                const hasData = Object.values(d.meals).some(m => m.grade !== null);
                const col = isWE ? "#a78b5e" : hasData ? scoreLabel(sc).color : "#2a1f10";
                return (
                  <div key={i} style={{ flex: 1, background: col + "18", border: `1px solid ${col}44`, borderRadius: 8, padding: "8px 3px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: "#4a3820", marginBottom: 3 }}>{DAYS_SHORT[i]}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: col }}>{isWE ? "🍷" : hasData ? sc : "—"}</div>
                    {d.selfScore && <div style={{ fontSize: 9, color: "#6a5030", marginTop: 2 }}>😊{d.selfScore}</div>}
                  </div>
                );
              })}
            </div>

            {/* Week pct */}
            <div style={{ padding: "14px 16px", background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 10, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#a78b5e" }}>Weekday score</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: weekCol }}>{weekPct}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${weekPct}%`, background: weekCol, borderRadius: 2 }} />
              </div>
            </div>

            {/* Habit summary */}
            <Sec label="Habit Summary (weekdays)">
              {HABITS.map(h => {
                const vals = days.slice(0, 5).filter(d => d.habits[h.key] !== null).map(d => d.habits[h.key]);
                if (!vals.length) return null;
                const pos = h.bad ? vals.filter(v => !v).length : vals.filter(v => v).length;
                const pct = Math.round(pos / vals.length * 100);
                const col = pct >= 75 ? "#4caf82" : pct >= 50 ? "#f0a500" : "#e05c5c";
                return (
                  <div key={h.key} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#a09070" }}>{h.icon} {h.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{pct}%</span>
                    </div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </Sec>

            {/* Meals logged */}
            <Sec label="Meals This Week">
              {days.slice(0, 5).map((d, i) => {
                const hasAny = Object.values(d.meals).some(m => m.text);
                if (!hasAny) return null;
                return (
                  <div key={i} style={{ marginBottom: 10, padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, borderLeft: "2px solid rgba(167,139,94,0.4)" }}>
                    <div style={{ fontSize: 10, color: "#a78b5e", marginBottom: 6, letterSpacing: 2 }}>{DAYS_SHORT[i].toUpperCase()}</div>
                    {["Breakfast", "Lunch", "Dinner"].map(meal => {
                      const m = d.meals[meal];
                      if (!m.text) return null;
                      return (
                        <div key={meal} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color: "#7a6a50" }}>{meal}: <span style={{ color: "#a09070" }}>{m.text}</span></span>
                          {m.grade !== null && <span style={{ fontSize: 11, fontWeight: 700, color: gradeColor(m.grade) }}>{m.emoji} {gradeLabel(m.grade)}</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </Sec>

            {/* Screen time */}
            {days.some(d => d.screenTime) && (
              <Sec label="Screen Time">
                {days.map((d, i) => d.screenTime ? (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#6a5a45" }}>{DAYS_SHORT[i]}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: parseFloat(d.screenTime) <= 2 ? "#4caf82" : parseFloat(d.screenTime) <= 4 ? "#f0a500" : "#e05c5c" }}>{d.screenTime}h</span>
                  </div>
                ) : null)}
              </Sec>
            )}

            {/* Reflections */}
            {days.some(d => d.selfNote) && (
              <Sec label="Reflections">
                {days.map((d, i) => d.selfNote ? (
                  <div key={i} style={{ marginBottom: 10, padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, borderLeft: "2px solid #a78b5e" }}>
                    <div style={{ fontSize: 10, color: "#a78b5e", marginBottom: 4 }}>{DAYS_SHORT[i]}{d.selfScore ? ` · ${d.selfScore}/10` : ""}</div>
                    <div style={{ fontSize: 13, color: "#a09070", lineHeight: 1.6 }}>{d.selfNote}</div>
                  </div>
                ) : null)}
              </Sec>
            )}

            <button onClick={() => setShowCloseWeek(true)} style={{
              width: "100%", padding: "14px", borderRadius: 10, cursor: "pointer", marginTop: 8,
              background: "linear-gradient(135deg,#9a7a40,#c9a96e)", border: "none",
              color: "#0e0c06", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
            }}>Close Week & Archive →</button>

            {showCloseWeek && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
                <div style={{ background: "#1a1208", border: "1px solid rgba(201,169,110,0.3)", borderRadius: 16, padding: 24, width: "100%", maxWidth: 380 }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 6 }}>Close Week {currentWeek}?</div>
                  <div style={{ fontSize: 13, color: "#6a5030", marginBottom: 20 }}>This archives the week and starts Week {currentWeek + 1}. Data is saved.</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setShowCloseWeek(false)} style={{ flex: 1, padding: "12px", borderRadius: 9, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#a09070", fontSize: 13 }}>Cancel</button>
                    <button onClick={closeWeek} style={{ flex: 2, padding: "12px", borderRadius: 9, cursor: "pointer", border: "none", background: "linear-gradient(135deg,#9a7a40,#c9a96e)", color: "#0e0c06", fontSize: 13, fontWeight: 700 }}>Archive & Start Week {currentWeek + 1}</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══ HISTORY ═════════════════════════════════════════════════════════ */}
        {tab === "History" && (
          <>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 16 }}>Past Weeks</div>
            {pastWeeks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#4a3820" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📖</div>
                <div style={{ fontSize: 14 }}>No archived weeks yet.<br />Close your first week to see history.</div>
              </div>
            ) : (
              [...pastWeeks].reverse().map(pw => (
                <div key={pw.week} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 16px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18 }}>Week {pw.week}</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: pw.report.pct >= 75 ? "#4caf82" : pw.report.pct >= 55 ? "#f0a500" : "#e05c5c" }}>{pw.report.pct}%</span>
                  </div>
                  <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                    {pw.days.map((d, i) => {
                      const sc = calcDayScore(d);
                      const isWE = i >= 5;
                      const col = isWE ? "#a78b5e" : scoreLabel(sc).color;
                      return (
                        <div key={i} style={{ flex: 1, background: col + "18", border: `1px solid ${col}33`, borderRadius: 6, padding: "5px 2px", textAlign: "center" }}>
                          <div style={{ fontSize: 8, color: "#4a3820" }}>{DAYS_SHORT[i]}</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: col }}>{isWE ? "🍷" : sc}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {pw.report.avgSelf && <span style={{ fontSize: 12, color: "#6a5030" }}>Feel: <b style={{ color: "#c9a96e" }}>{pw.report.avgSelf}/10</b></span>}
                    {pw.report.avgScreen && <span style={{ fontSize: 12, color: "#6a5030" }}>Screen: <b style={{ color: "#c9a96e" }}>{pw.report.avgScreen}h/day</b></span>}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8,
  padding: "10px 13px", color: "#e8dcc8", fontSize: 13, outline: "none",
};

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Sec({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#a78b5e", marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

function MealInput({ meal, data, onChange, onGrade }) {
  const hasGrade = data.grade !== null && data.grade !== undefined;
  const col = gradeColor(data.grade);
  return (
    <div style={{ marginBottom: 12, padding: "12px 13px", background: "rgba(255,255,255,0.02)", border: `1px solid ${hasGrade ? col + "44" : "rgba(255,255,255,0.07)"}`, borderRadius: 9 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#a78b5e", marginBottom: 8 }}>{meal}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={data.text}
          onChange={e => onChange(e.target.value)}
          placeholder={`What did you have for ${meal.toLowerCase()}?`}
          style={{ ...inputStyle, flex: 1, padding: "9px 11px", fontSize: 13 }}
        />
        <button className="btn" onClick={onGrade} disabled={!data.text.trim() || data.grading} style={{
          padding: "9px 13px", borderRadius: 8, cursor: data.text.trim() ? "pointer" : "default",
          border: "1px solid rgba(201,169,110,0.4)", background: "rgba(201,169,110,0.1)",
          color: "#c9a96e", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", opacity: data.text.trim() ? 1 : 0.4,
        }}>
          {data.grading ? "..." : "Grade"}
        </button>
      </div>
      {hasGrade && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 18 }}>{data.emoji}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{gradeLabel(data.grade)}</span>
          <span style={{ fontSize: 12, color: "#8a7060" }}>— {data.feedback}</span>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, onEdit, onDelete, onToggle }) {
  const rawPct = goal.lowerIsBetter
    ? Math.max(0, Math.min(100, Math.round((1 - (goal.progress - goal.target) / Math.max(goal.progress, 1)) * 100)))
    : Math.min(100, Math.round((goal.progress / goal.target) * 100));
  const pct = isNaN(rawPct) ? 0 : rawPct;
  const col = goal.completed ? "#4caf82" : pct >= 75 ? "#4caf82" : pct >= 40 ? "#f0a500" : "#e05c5c";
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${goal.completed ? "#4caf8233" : "rgba(255,255,255,0.08)"}`, borderRadius: 11, padding: "14px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <button onClick={onToggle} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${goal.completed ? "#4caf82" : "rgba(255,255,255,0.2)"}`, background: goal.completed ? "#4caf82" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#0d0b08", flexShrink: 0 }}>
              {goal.completed && "✓"}
            </button>
            <span style={{ fontSize: 14, fontWeight: 500, color: goal.completed ? "#6a8a70" : "#e8dcc8", textDecoration: goal.completed ? "line-through" : "none" }}>{goal.title}</span>
          </div>
          {goal.desc && <div style={{ fontSize: 12, color: "#6a5030", marginLeft: 26 }}>{goal.desc}</div>}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", color: "#6a5030", fontSize: 14 }}>✎</button>
          <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#4a2020", fontSize: 14 }}>×</button>
        </div>
      </div>
      <div style={{ marginLeft: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6a5030", marginBottom: 4 }}>
          <span>{goal.lowerIsBetter ? `${goal.progress} → ${goal.target} ${goal.unit}` : `${goal.progress} / ${goal.target} ${goal.unit}`}</span>
          <span style={{ color: col, fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 2, transition: "width 0.4s" }} />
        </div>
      </div>
    </div>
  );
}

function GoalEditor({ goal, onChange, onSave, onCancel, isNew }) {
  return (
    <div style={{ background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: 11, padding: "14px", marginBottom: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: "#a78b5e", marginBottom: 10 }}>{isNew ? "NEW GOAL" : "EDIT GOAL"}</div>
      {[["title", "Goal title"], ["desc", "Description (optional)"]].map(([k, ph]) => (
        <input key={k} value={goal[k]} onChange={e => onChange({ ...goal, [k]: e.target.value })}
          placeholder={ph} style={{ ...inputStyle, marginBottom: 8 }} />
      ))}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input type="number" value={goal.progress} onChange={e => onChange({ ...goal, progress: parseFloat(e.target.value) || 0 })} placeholder="Current" style={{ ...inputStyle, flex: 1 }} />
        <input type="number" value={goal.target} onChange={e => onChange({ ...goal, target: parseFloat(e.target.value) || 100 })} placeholder="Target" style={{ ...inputStyle, flex: 1 }} />
        <input value={goal.unit} onChange={e => onChange({ ...goal, unit: e.target.value })} placeholder="Unit" style={{ ...inputStyle, flex: 1 }} />
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#8a7060", marginBottom: 12, cursor: "pointer" }}>
        <input type="checkbox" checked={!!goal.lowerIsBetter} onChange={e => onChange({ ...goal, lowerIsBetter: e.target.checked })} />
        Lower is better (e.g. weight, time)
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: "9px", borderRadius: 7, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#8a7060", fontSize: 12 }}>Cancel</button>
        <button onClick={onSave} style={{ flex: 2, padding: "9px", borderRadius: 7, cursor: "pointer", border: "none", background: "#c9a96e", color: "#0e0c06", fontSize: 12, fontWeight: 700 }}>Save Goal</button>
      </div>
    </div>
  );
}

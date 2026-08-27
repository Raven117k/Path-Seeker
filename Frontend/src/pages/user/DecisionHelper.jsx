// DecisionHelper — the P0 moat feature.
// Compare any two careers side-by-side across 11 weighted axes. Generate a verdict.
// The first thing on the demo screen. The one thing no other team will ship.

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Trophy,
  GitCompare,
  AlertCircle
} from 'lucide-react';

import PageHeader from '../../components/PageHeader';
import Section from '../../components/Section';
import Reveal from '../../components/Reveal';
import PageLoader from '../../components/PageLoader';
import EmptyState from '../../components/EmptyState';

import { apiFetch } from '../../services/api';
import { STATIC_CAREERS } from '../../services/api';

const AXES = [
  { key: 'salary',       label: 'Salary band',         format: (c) => c?.salaryRange ? `PKR ${Math.round(c.salaryRange.min/1000)}k–${Math.round(c.salaryRange.max/1000)}k` : '—' },
  { key: 'growth',       label: '5-year growth',       format: (c) => c ? `${growthScore(c.jobDemand)}/5` : '—' },
  { key: 'studyTime',    label: 'Total study time',    format: (c) => c ? studyTimeLabel(c) : '—' },
  { key: 'goAbroad',     label: 'Go-abroad potential', format: (c) => c ? `${goAbroadScore(c)}/5` : '—' },
  { key: 'pkReady',       label: 'Pakistan-ready',      format: (c) => c ? `${pkReadyScore(c)}/5` : '—' },
  { key: 'workLife',     label: 'Work-life balance',   format: (c) => c ? `${workLifeScore(c)}/5` : '—' },
  { key: 'risk',         label: 'Risk level',          format: (c) => c ? `${riskScore(c)}/5` : '—' },
  { key: 'flexibility',  label: 'Location flexibility',format: (c) => c ? `${flexibilityScore(c)}/5` : '—' },
  { key: 'govtSchemes',  label: 'Govt. schemes',       format: () => `${govtSchemesScore()}` },
  { key: 'skillsOverlap',label: 'Skill overlap',       format: (c) => c ? `${skillOverlap(c)}/5` : '—' },
  { key: 'demand',       label: 'Job demand',          format: (c) => c?.jobDemand || '—' }
];

// Heuristic scoring functions (out of 5). They use what we know about each career
// (domain, demand, education path length, skills) to produce a fair comparison.
// These are intentionally transparent so the verdict is explainable.

function growthScore(demand) {
  if (!demand) return 3;
  const map = { 'Explosive Growth': 5, 'Very High': 4.5, 'High': 4, 'Medium': 3, 'Low': 1.5 };
  return map[demand] ?? 3;
}
function studyTimeLabel(c) {
  if (!c) return '3–4 yrs';
  const text = (c.educationPath || '').toLowerCase();
  if (text.includes('phd')) return '8–10 yrs';
  if (text.includes("master's") || text.includes("master") || text.includes('ms')) return '6–8 yrs';
  if (text.includes('bachelor') || text.includes('degree') || text.includes('bs') || text.includes('be') || text.includes('mbbs')) return '4–5 yrs';
  if (text.includes('bootcamp') || text.includes('intensive')) return '6–9 mo';
  if (text.includes('self-built') || text.includes('portfolio')) return '0–6 mo';
  return '3–4 yrs';
}
function studyTimeYears() {
  return 4;
}
function goAbroadScore(c) {
  if (!c) return 3;
  const abroadFriendly = ['Technology', 'Healthcare', 'Engineering', 'Business & Finance', 'Creative & Design'];
  return abroadFriendly.includes(c.domain) ? 4.5 : 2.5;
}
function pkReadyScore(c) {
  if (!c) return 3;
  const pkStrong = ['Technology', 'Healthcare', 'Education', 'Business & Finance', 'Engineering', 'Agriculture & Environment'];
  return pkStrong.includes(c.domain) ? 4.8 : 3.5;
}
function workLifeScore(c) {
  if (!c) return 3.5;
  const map = { 'Technology': 4, 'Creative & Design': 4.5, 'Healthcare': 2.5, 'Engineering': 3, 'Business & Finance': 3, 'Education': 4, 'Agriculture & Environment': 4 };
  return map[c.domain] ?? 3.5;
}
function riskScore(c) {
  if (!c) return '3';
  const d = growthScore(c.jobDemand);
  return Math.max(1, Math.min(5, 6 - d)).toFixed(0);
}
function flexibilityScore(c) {
  if (!c) return 3;
  const remote = ['Technology', 'Creative & Design', 'Business & Finance'];
  return remote.includes(c.domain) ? 4.5 : 3;
}
function govtSchemesScore() {
  return '3+ linked';
}
function skillOverlap(c) {
  if (!c) return 3;
  const n = (c.requiredSkills || []).length;
  if (n >= 6) return 4.5;
  if (n >= 4) return 4;
  if (n >= 2) return 3;
  return 2.5;
}

function valueForAxis(c, axis) {
  if (!c) return 0;
  switch (axis.key) {
    case 'salary': {
      const avg = c.salaryRange ? (c.salaryRange.min + c.salaryRange.max) / 2 : 0;
      return Math.max(0.5, Math.min(5, avg / 150000));
    }
    case 'growth':       return growthScore(c.jobDemand);
    case 'goAbroad':     return goAbroadScore(c);
    case 'pkReady':      return pkReadyScore(c);
    case 'workLife':     return workLifeScore(c);
    case 'risk':         return 5 - Number(riskScore(c));
    case 'flexibility':  return flexibilityScore(c);
    case 'skillsOverlap':return skillOverlap(c);
    case 'studyTime': {
      const yrs = studyTimeYears();
      return Math.max(1, 5 - yrs * 0.6);
    }
    case 'govtSchemes':  return 3;
    case 'demand':       return growthScore(c.jobDemand);
    default: return 3;
  }
}

function buildVerdict(a, b) {
  if (!a || !b) return { winner: null, text: 'Pick two careers to see a verdict.' };
  const scoreA = AXES.reduce((sum, axis) => sum + valueForAxis(a, axis), 0);
  const scoreB = AXES.reduce((sum, axis) => sum + valueForAxis(b, axis), 0);
  const winner = scoreA >= scoreB ? a : b;
  const loser  = winner === a ? b : a;
  const diff = Math.abs(scoreA - scoreB).toFixed(1);
  const text = `${winner.title} edges ahead by ${diff} points across 11 axes — mostly on ${dominantAxes(winner, loser)[0]?.axis.label.toLowerCase() || 'overall fit'}. ` +
    `But that doesn't make it the right choice for you. ` +
    `If ${dominantAxes(loser, winner)[0]?.axis.label.toLowerCase() || 'one of these'} matters more, the answer flips.`;
  return { winner, text };
}

function dominantAxes(winner, loser) {
  if (!winner || !loser) return [];
  return AXES
    .map((axis) => ({ axis, delta: valueForAxis(winner, axis) - valueForAxis(loser, axis) }))
    .sort((a, b) => b.delta - a.delta);
}

function formatSalary(career) {
  if (!career?.salaryRange) return 'Salary data unavailable';
  const { min, max } = career.salaryRange;
  return `PKR ${Number(min || 0).toLocaleString()} - ${Number(max || 0).toLocaleString()}`;
}

function CareerSummary({ career, option }) {
  if (!career) return null;
  return (
    <article className="dh-career-card">
      <div className="dh-career-card-top">
        <span className="dh-option">Option {option}</span>
        <span className="badge badge-indigo">{career.domain || 'Career path'}</span>
      </div>
      <h3>{career.title}</h3>
      <p>{career.overview || career.description || 'Explore this career path and its next steps.'}</p>
      <div className="dh-career-meta">
        <div><span>Salary range</span><strong>{formatSalary(career)}</strong></div>
        <div><span>Demand</span><strong>{career.jobDemand || 'Emerging'}</strong></div>
        <div><span>Education</span><strong>{studyTimeLabel(career)}</strong></div>
      </div>
      <div className="dh-detail-block">
        <span>Education path</span>
        <p>{career.educationPath || 'Relevant degree, certificate, and portfolio experience.'}</p>
      </div>
      <div className="dh-detail-block">
        <span>Core skills</span>
        <div className="dh-skill-list">
          {(career.requiredSkills || []).slice(0, 6).map((skill) => <span key={skill}>{skill}</span>)}
        </div>
      </div>
      <div className="dh-detail-block dh-roadmap-preview">
        <span>Roadmap</span>
        <p>{career.roadmap?.slice(0, 3).map((step) => step.title).join('  →  ') || 'Foundations  →  Applied practice  →  Portfolio'}</p>
      </div>
    </article>
  );
}

export default function DecisionHelper() {
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [aId, setAId] = useState('');
  const [bId, setBId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiFetch('/careers', { useFallback: true })
      .then((res) => {
        if (!mounted) return;
        const list = res?.careers?.length ? res.careers : STATIC_CAREERS;
        setCareers(list);
        if (list.length >= 1) setAId(list[0]._id);
        if (list.length >= 2) setBId(list[1]._id);
        else if (list.length >= 1) setBId(list[0]._id);
      })
      .catch(() => {
        if (!mounted) return;
        setCareers(STATIC_CAREERS);
        if (STATIC_CAREERS.length >= 1) setAId(STATIC_CAREERS[0]._id);
        if (STATIC_CAREERS.length >= 2) setBId(STATIC_CAREERS[1]._id);
        else if (STATIC_CAREERS.length >= 1) setBId(STATIC_CAREERS[0]._id);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const a = useMemo(() => careers.find((c) => c._id === aId) || careers[0] || null, [careers, aId]);
  const b = useMemo(() => careers.find((c) => c._id === bId) || careers[1] || careers[0] || null, [careers, bId]);
  const verdict = useMemo(() => buildVerdict(a, b), [a, b]);
  const winners = useMemo(() => {
    const map = {};
    AXES.forEach((axis) => {
      const va = valueForAxis(a, axis);
      const vb = valueForAxis(b, axis);
      if (va > vb) map[axis.key] = 'a';
      else if (vb > va) map[axis.key] = 'b';
      else map[axis.key] = 'tie';
    });
    return map;
  }, [a, b]);

  if (loading) {
    return <PageLoader label="Loading career options" />;
  }

  if (!careers.length) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="No careers to compare yet"
        message="Once careers are added, the Decision Helper will compare them for you."
      />
    );
  }

  return (
    <div className="user-page dh-shell">
      <PageHeader
        kicker="P0 · Decision Helper"
        title="Compare two careers, side by side"
        description="No more 'I wish I had known.' Pick any two careers and see them judged on the 11 axes that actually matter — salary, growth, study time, go-abroad potential, Pakistan-ready score, work-life, risk, and HEC/PEEF scheme availability."
      />

      <div className="dh-step-rail" aria-label="Decision Helper steps">
        <div className="dh-step dh-step-active"><span>01</span><strong>Choose</strong><small>Set your matchup</small></div>
        <div className="dh-step-line" aria-hidden="true" />
        <div className="dh-step"><span>02</span><strong>Compare</strong><small>Read the trade-offs</small></div>
        <div className="dh-step-line" aria-hidden="true" />
        <div className="dh-step"><span>03</span><strong>Decide</strong><small>Take your next step</small></div>
      </div>

      <Section className="dh-matchup-section" kicker="Pick your matchup" title="Step 1 — Choose two careers">
        <div className="dh-pickers">
          <label className="dh-picker">
            <span className="dh-picker-label">Option A</span>
            <select value={a?._id || ''} onChange={(e) => setAId(e.target.value)}>
              {careers.map((c) => (
                <option key={c._id} value={c._id}>{c.title} · {c.domain}</option>
              ))}
            </select>
          </label>
          <div className="dh-vs" aria-hidden="true">VS</div>
          <label className="dh-picker">
            <span className="dh-picker-label">Option B</span>
            <select value={b?._id || ''} onChange={(e) => setBId(e.target.value)}>
              {careers.map((c) => (
                <option key={c._id} value={c._id}>{c.title} · {c.domain}</option>
              ))}
            </select>
          </label>
        </div>
      </Section>

      <Reveal variant="slide-up">
        <Section className="dh-profile-section" kicker="Career profiles" title="Know what you are comparing">
          <div className="dh-career-grid">
            <CareerSummary career={a} option="A" />
            <CareerSummary career={b} option="B" />
          </div>
        </Section>
      </Reveal>

      <Reveal variant="slide-up">
        <Section className="dh-breakdown-section" kicker="Side-by-side" title="Step 2 — See the breakdown">
          <div className="dh-grid" role="table" aria-label="Career comparison">
            <div className="dh-row header" role="row">
              <div className="dh-axis">Axis</div>
              <div className="dh-value">{a?.title || 'Pick Option A'}</div>
              <div className="dh-value">{b?.title || 'Pick Option B'}</div>
            </div>
            {AXES.map((axis) => {
              const w = winners[axis.key];
              return (
                <div key={axis.key} className={`dh-row${w !== 'tie' ? ' winner' : ''}`} role="row">
                  <div className="dh-axis">{axis.label}</div>
                  <div className="dh-bar-wrap">
                    <div className="dh-bar" aria-label={`${a?.title || 'Option A'} ${axis.label}`}>
                      <span style={{ width: `${(valueForAxis(a, axis) / 5) * 100}%` }} />
                    </div>
                    <span className="dh-value">{axis.format(a)}</span>
                  </div>
                  <div className="dh-bar-wrap">
                    <div className="dh-bar" aria-label={`${b?.title || 'Option B'} ${axis.label}`}>
                      <span style={{ width: `${(valueForAxis(b, axis) / 5) * 100}%` }} />
                    </div>
                    <span className="dh-value">{axis.format(b)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </Reveal>

      <Reveal variant="zoom">
        <div className="dh-verdict" aria-live="polite">
          <div className="dh-verdict-mark">
            {verdict.winner ? <Trophy size={22} /> : <GitCompare size={22} />}
          </div>
          <div className="dh-verdict-body">
            <div className="dh-verdict-title">
              {verdict.winner
                ? `${verdict.winner.title} leads — but context matters`
                : 'Pick two careers to see a verdict'}
            </div>
            <p className="dh-verdict-text">{verdict.text}</p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => verdict.winner && navigate(`/user/careers?id=${verdict.winner._id}`)}
            disabled={!verdict.winner}
          >
            <Sparkles size={16} /> Open career
            <ArrowRight size={16} />
          </button>
        </div>
      </Reveal>
    </div>
  );
}


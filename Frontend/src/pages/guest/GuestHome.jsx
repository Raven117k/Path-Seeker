import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight, Award, BookOpen, BriefcaseBusiness, Check, Compass,
  FileText, GraduationCap, Map, PlayCircle, Sparkles, TrendingUp, Users,
  GitCompare, Star, Zap, Heart
} from 'lucide-react';

import Counter from '../../components/Counter';
import Marquee from '../../components/Marquee';
import Reveal from '../../components/Reveal';
import { t } from '../../i18n';

const roleContent = {
  student: { icon: GraduationCap, label: 'Student passport', title: 'Turn curiosity into a direction.', copy: 'Find subjects that energize you, compare real career paths, and leave with a roadmap you can actually follow.', match: 'Technology & AI Innovation', progress: '72%' },
  graduate: { icon: BookOpen, label: 'Graduate passport', title: 'Make your next move count.', copy: 'Translate your degree into practical skills, stronger applications, and a shortlist of roles worth pursuing.', match: 'Product & Data Strategy', progress: '84%' },
  professional: { icon: BriefcaseBusiness, label: 'Professional passport', title: 'Navigate your next chapter.', copy: 'Spot high-demand skills, map a credible transition, and make your experience work harder for your ambitions.', match: 'AI Operations & Leadership', progress: '91%' }
};

const TRUST_BADGES = [
  { icon: Sparkles, label: 'AI-powered quiz' },
  { icon: GitCompare, label: 'Side-by-side compare' },
  { icon: Zap, label: '90-day action plans' },
  { icon: Heart, label: 'Built for Pakistan' },
  { icon: Star, label: 'Free forever' },
  { icon: Map, label: 'Mobile-ready' }
];

export default function GuestHome() {
  const { openAuthModal, setSitemapOpen, user } = useAuth();
  const [activeRole, setActiveRole] = useState('student');
  const role = roleContent[activeRole];
  const RoleIcon = role.icon;
  const dashboardHref = user
    ? (user.role === 'admin' ? '/admin/' : '/user/dashboard')
    : null;

  return (
    <div className="home-page">
      <section className="home-hero mesh-bg">
        <div className="dot-field" aria-hidden="true" />
        <div className="home-hero-orbit home-hero-orbit--one" />
        <div className="home-hero-orbit home-hero-orbit--two" />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <Reveal variant="fade" delay={50}>
              <div className="eyebrow"><span className="eyebrow-dot" /> Your career, made navigable</div>
            </Reveal>
            <Reveal variant="slide-up" delay={120}>
              <h1>Choose a direction.<br /><span className="animated-gradient">Build the route.</span></h1>
            </Reveal>
            <Reveal variant="slide-up" delay={220}>
              <p className="home-hero-lede">PathSeeker turns scattered career advice into a personal passport for better decisions, sharper skills, and work that fits.</p>
            </Reveal>
            <Reveal variant="slide-up" delay={320}>
              <div className="home-hero-actions">
                <button
                  onClick={() => dashboardHref ? (window.location.href = dashboardHref) : openAuthModal('register')}
                  className="btn-primary home-primary-action"
                >
                  {user ? 'Open my dashboard' : 'Create your passport'} <ArrowRight size={17} />
                </button>
                <Link to="/user/decision-helper" className="home-text-action">
                  Try the Decision Helper <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
            <Reveal variant="slide-up" delay={420}>
              <div className="home-trust-line">
                <Users size={16} /> Built for students, graduates, and professionals
                <span>•</span> <Check size={16} /> Free to start
                <span>•</span> <Check size={16} /> Mobile-ready
              </div>
            </Reveal>
          </div>
          <Reveal variant="zoom" delay={300}>
            <div className="home-dashboard-preview" aria-label="PathSeeker passport preview">
              <div className="preview-topline"><span><span className="status-dot" /> Passport preview</span><span className="preview-menu">•••</span></div>
              <div className="preview-profile"><div className="preview-avatar"><Compass size={23} /></div><div><strong>Alex Morgan</strong><small>Career explorer · {activeRole}</small></div><span className="preview-live">ACTIVE</span></div>
              <div className="preview-score-row"><div><small>YOUR DIRECTION SCORE</small><strong>8.6 <span>/ 10</span></strong></div><div className="score-ring"><span>86%</span></div></div>
              <div className="preview-route"><div className="preview-route-heading"><span>Recommended route</span><TrendingUp size={16} /></div><strong>{role.match}</strong><div className="preview-progress"><span style={{ width: role.progress }} /></div><small>{role.progress} profile alignment <b>↗</b></small></div>
              <div className="preview-footer"><span><Award size={15} /> 4 milestones</span><span><FileText size={15} /> 2 saved guides</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee speed={36} className="home-marquee">
        {TRUST_BADGES.map((b) => {
          const Icon = b.icon;
          return (
            <span key={b.label} className="home-marquee-item">
              <Icon size={16} /> {b.label}
            </span>
          );
        })}
      </Marquee>

      <Reveal variant="slide-up">
        <section className="home-stat-strip" aria-label="PathSeeker highlights">
          <div>
            <strong><Counter target={50} suffix="+" /></strong>
            <small>career paths</small>
          </div>
          <div>
            <strong><Counter target={7} /></strong>
            <small>career domains</small>
          </div>
          <div>
            <strong><Counter target={3} /></strong>
            <small>experience stages</small>
          </div>
          <div>
            <strong><Counter target={1} /></strong>
            <small>clearer next step</small>
          </div>
        </section>
      </Reveal>

      <Reveal variant="slide-up">
        <section className="home-section home-audience-section">
          <div className="home-section-heading">
            <div>
              <span className="section-kicker">One platform, your context</span>
              <h2>Start from where<br /><em>you are.</em></h2>
            </div>
            <p>Career advice gets useful when it respects the stage you are in. Pick a passport to see how PathSeeker adapts.</p>
          </div>
          <div className="role-tabs" role="tablist" aria-label="Passport stages">
            {Object.entries(roleContent).map(([key, content]) => {
              const Icon = content.icon;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeRole === key}
                  className={activeRole === key ? 'role-tab role-tab--active' : 'role-tab'}
                  onClick={() => setActiveRole(key)}
                >
                  <Icon size={18} /><span>{content.label}</span><ArrowRight size={15} />
                </button>
              );
            })}
          </div>
          <div className="role-feature">
            <div className="role-feature-copy">
              <div className="role-icon"><RoleIcon size={22} /></div>
              <span className="section-kicker">{role.label}</span>
              <h3>{role.title}</h3>
              <p>{role.copy}</p>
              <button
                onClick={() => openAuthModal('register')}
                className="btn-primary"
              >
                Build this passport <ArrowRight size={16} />
              </button>
            </div>
            <div className="role-route-list">
              <div className="route-list-head"><span>Your route starts here</span><span>03 steps</span></div>
              <div className="route-item route-item--done">
                <span>01</span>
                <div><strong>Know your interests</strong><small>AI-powered interest quiz</small></div>
                <Check size={17} />
              </div>
              <div className="route-item route-item--current">
                <span>02</span>
                <div><strong>Compare your options</strong><small>Career bank + role fit</small></div>
                <ArrowRight size={17} />
              </div>
              <div className="route-item">
                <span>03</span>
                <div><strong>Make it actionable</strong><small>Roadmaps, guides, and stories</small></div>
                <span className="route-lock">○</span>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal variant="slide-up">
        <section className="home-section home-tools-section">
          <div className="home-section-heading home-section-heading--tools">
            <div>
              <span className="section-kicker">Everything in one place</span>
              <h2>A better way to<br /><em>move forward.</em></h2>
            </div>
            <Link to="/resources" className="home-text-action">See all resources <ArrowRight size={16} /></Link>
          </div>
          <div className="home-tool-grid">
            <article className="home-tool-card home-tool-card--blue">
              <div className="tool-card-icon"><Compass size={21} /></div>
              <span className="tool-card-index">01 / Discover</span>
              <h3>Find your fit</h3>
              <p>Filter real roles by domain, demand, salary, and the skills you want to grow.</p>
              <Link to="/careers">Open career bank <ArrowRight size={15} /></Link>
            </article>
            <article className="home-tool-card home-tool-card--yellow">
              <div className="tool-card-icon"><GitCompare size={21} /></div>
              <span className="tool-card-index">02 / Compare</span>
              <h3>Decide with confidence</h3>
              <p>Put any two careers side by side. Salary, study time, risk, growth — the 11 axes that actually matter.</p>
              <Link to="/user/decision-helper">Open Decision Helper <ArrowRight size={15} /></Link>
            </article>
            <article className="home-tool-card home-tool-card--green">
              <div className="tool-card-icon"><Map size={21} /></div>
              <span className="tool-card-index">03 / Act</span>
              <h3>Make a roadmap</h3>
              <p>Save notes, collect guides, and turn a promising direction into your next step.</p>
              <Link to="/resources">Open resource room <ArrowRight size={15} /></Link>
            </article>
          </div>
        </section>
      </Reveal>

      <Reveal variant="slide-up">
        <section className="home-bottom-cta">
          <div className="bottom-cta-mark"><PlayCircle size={25} /></div>
          <div>
            <span className="section-kicker">Your next chapter is already taking shape</span>
            <h2>Stop guessing.<br /><span>Start seeking.</span></h2>
          </div>
          <div className="bottom-cta-actions">
            <button onClick={() => openAuthModal('register')} className="btn-primary">
              Get your free passport <ArrowRight size={16} />
            </button>
            <button onClick={() => setSitemapOpen(true)} className="btn-secondary">
              <Map size={16} /> View how it works
            </button>
          </div>
        </section>
      </Reveal>

      {!user && (
        <button
          className="floating-cta"
          onClick={() => openAuthModal('register')}
          aria-label="Get your free passport"
        >
          <Sparkles size={16} /> Get your passport
        </button>
      )}
    </div>
  );
}

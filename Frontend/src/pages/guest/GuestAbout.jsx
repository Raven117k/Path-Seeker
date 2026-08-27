import { ArrowRight, Compass, GitCompare, Heart, Map, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../../components/Reveal';

const principles = [
  {
    icon: Target,
    number: '01',
    title: 'Clarity over noise',
    text: 'We turn a long list of possibilities into one useful next step, supported by transparent trade-offs.'
  },
  {
    icon: Heart,
    number: '02',
    title: 'Context before advice',
    text: 'A Matric student, a fresh graduate, and a working professional need different routes. PathSeeker adapts.'
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: 'Useful for real life',
    text: 'Career choices include study time, affordability, local opportunity, and the skills you can build today.'
  }
];

const steps = [
  { icon: Users, title: 'Choose your stage', text: 'Start with the decision in front of you: school, graduation, or a career transition.' },
  { icon: Sparkles, title: 'Decode your fit', text: 'Use the interest quiz and Career Bank to connect strengths with realistic pathways.' },
  { icon: GitCompare, title: 'Make the call', text: 'Compare two careers, save your evidence, and leave with a route you can act on.' }
];

export default function GuestAbout() {
  return (
    <div className="about-page">
      <section className="about-hero mesh-bg">
        <div className="dot-field" aria-hidden="true" />
        <div className="about-hero-orbit about-hero-orbit--one" aria-hidden="true" />
        <div className="about-hero-orbit about-hero-orbit--two" aria-hidden="true" />
        <div className="about-hero-inner">
          <Reveal variant="slide-left" delay={60}>
            <div className="about-hero-copy">
              <span className="eyebrow"><span className="eyebrow-dot" /> The idea behind PathSeeker</span>
              <h1>Career guidance should feel like a <span className="animated-gradient">clearer map.</span></h1>
              <p>PathSeeker is a Career Passport for Pakistan: a calm, practical place to understand your options after Matric, F.Sc, ICS, university, or a career pivot.</p>
              <div className="about-hero-actions">
                <Link to="/careers" className="btn-primary">Explore career paths <ArrowRight size={17} /></Link>
                <Link to="/" className="home-text-action">Back to home <ArrowRight size={16} /></Link>
              </div>
            </div>
          </Reveal>
          <Reveal variant="zoom" delay={220}>
            <div className="about-passport-art" aria-label="PathSeeker Career Passport concept">
              <div className="about-passport-stamp"><Compass size={30} /><span>PK</span></div>
              <div className="about-passport-copy"><small>CAREER PASSPORT</small><strong>Find your<br /><em>north.</em></strong><span>50+ paths · 3 stages · 1 next step</span></div>
              <div className="about-passport-route"><Map size={18} /><span>From curiosity</span><i /><span>to career</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal variant="slide-up" delay={100}>
        <section className="about-intro about-section">
          <div><span className="section-kicker">Why we built it</span><h2>The hardest career question is often the first one.</h2></div>
          <p>Students and professionals do not need another generic listicle. They need a way to connect their interests, academic route, financial reality, and local opportunities to a decision they can explain to themselves and their families.</p>
        </section>
      </Reveal>

      <section className="about-principles about-section">
        <Reveal variant="slide-up"><div className="about-section-heading"><span className="section-kicker">Our point of view</span><h2>Built around better decisions.</h2></div></Reveal>
        <div className="about-principle-grid">
          {principles.map(({ icon: Icon, number, title, text }, index) => (
            <Reveal key={number} variant="slide-up" delay={index * 100}>
              <article className="about-principle-card"><span className="about-card-number">{number}</span><Icon size={23} /><h3>{title}</h3><p>{text}</p></article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about-process about-section">
        <Reveal variant="slide-right"><div className="about-process-heading"><span className="section-kicker">The PathSeeker loop</span><h2>From uncertainty<br /><em>to momentum.</em></h2></div></Reveal>
        <div className="about-step-list">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} variant="slide-left" delay={index * 110}>
              <div className="about-step"><span className="about-step-index">0{index + 1}</span><Icon size={21} /><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={17} /></div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal variant="zoom">
        <section className="about-final about-section">
          <div className="about-final-mark"><Compass size={26} /></div>
          <span className="section-kicker">The promise</span>
          <h2>One honest comparison.<br /><span>One route forward.</span></h2>
          <p>PathSeeker helps people make career choices with more context, less pressure, and a practical first move.</p>
          <Link to="/user/decision-helper" className="btn-primary">Try Decision Helper <GitCompare size={16} /></Link>
        </section>
      </Reveal>
    </div>
  );
}

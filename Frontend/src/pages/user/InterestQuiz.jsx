import React, { useState, useEffect } from 'react';
import { apiFetch, STATIC_QUIZ_QUESTIONS, STATIC_CAREERS } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { HelpCircle, Clock, Award, CheckCircle2, ArrowRight, RotateCcw, Sparkles, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLoader from '../../components/PageLoader';

export default function InterestQuiz() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !quizCompleted) {
      const q = questions[currentStep];
      setTimeLeft(q?.timeLimitSeconds || 30);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNextStep();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, questions, quizCompleted]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/quiz/questions', { useFallback: true });
      setQuestions(res.questions || STATIC_QUIZ_QUESTIONS);
    } catch (err) {
      setQuestions(STATIC_QUIZ_QUESTIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex) => {
    const question = questions[currentStep];
    if (question?.type === 'multi_select') {
      const existing = Array.isArray(selectedAnswers[currentStep]) ? selectedAnswers[currentStep] : [];
      const next = existing.includes(optionIndex) ? existing.filter((index) => index !== optionIndex) : [...existing, optionIndex];
      setSelectedAnswers({ ...selectedAnswers, [currentStep]: next });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [currentStep]: optionIndex });
    }
    setValidationError('');
  };

  const handleNextStep = () => {
    const answer = selectedAnswers[currentStep];
    if (answer === undefined || (Array.isArray(answer) && answer.length === 0)) {
      setValidationError('Please answer this question before continuing.');
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      evaluateAndSubmitQuiz();
    }
  };

  const evaluateAndSubmitQuiz = async () => {
    setQuizCompleted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    // Build payload answers
    const answersPayload = questions.map((q, idx) => {
      const answer = selectedAnswers[idx];
      return q.type === 'multi_select'
        ? { questionId: q._id, selectedOptionIndexes: answer }
        : q.type === 'slider'
          ? { questionId: q._id, selectedOptionIndex: answer, sliderValue: answer }
          : { questionId: q._id, selectedOptionIndex: answer };
    });

    try {
      const res = await apiFetch('/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ answers: answersPayload })
      });

      if (res.result) {
        setResultData(res.result);
      } else {
        // Fallback calculation
        setResultData({
          topDomain: 'Technology',
          domainScores: { Technology: 15, Healthcare: 4, 'Business & Finance': 6, 'Creative & Design': 10 },
          recommendedCareers: STATIC_CAREERS.slice(0, 3)
        });
      }
    } catch (err) {
      setResultData({
        topDomain: 'Technology',
        domainScores: { Technology: 15, Healthcare: 4, 'Business & Finance': 6, 'Creative & Design': 10 },
        recommendedCareers: STATIC_CAREERS.slice(0, 3)
      });
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setResultData(null);
    setValidationError('');
  };

  if (loading) return <PageLoader label="Loading Quiz Questions..." />;

  const currentQ = questions[currentStep];

  return (
    <div className="user-page">
      {!quizCompleted ? (
        <div>
          {/* Progress Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-indigo">Question {currentStep + 1} of {questions.length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: timeLeft <= 5 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
              <Clock size={16} /> {timeLeft}s Timed Limit
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div
              style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
                height: '100%',
                background: 'var(--gradient-brand)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          {/* Quiz Question Card */}
          <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Category: {currentQ?.category || 'Career Aptitude'}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2rem', lineHeight: 1.3 }}>
              {currentQ?.questionText}
            </h2>

            {validationError && <div role="alert" style={{ color: 'var(--accent-rose)', fontWeight: 700, marginBottom: '1rem' }}>{validationError}</div>}

            {/* Options Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentQ?.type === 'slider' && <input type="range" min="0" max={Math.max(currentQ.options.length - 1, 0)} step="1" value={selectedAnswers[currentStep] ?? 0} onChange={(event) => handleSelectOption(Number(event.target.value))} aria-label="Select your answer" />}
              {currentQ?.options.map((opt, oIdx) => {
                const answer = selectedAnswers[currentStep];
                const isSelected = Array.isArray(answer) ? answer.includes(oIdx) : answer === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{opt.text}</span>
                    {isSelected && <CheckCircle2 size={20} color="var(--accent-primary)" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleNextStep} className="btn-primary" style={{ padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
              {currentStep < questions.length - 1 ? 'Next Question →' : (<><Sparkles size={16} /> Submit & Evaluate Quiz</>) }
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Results Display */
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Award size={36} color="var(--accent-emerald)" />
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Quiz Evaluation Complete!
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Your primary career affinity match is <strong style={{ color: 'var(--accent-primary)' }}>{resultData?.topDomain || 'Technology'}</strong>
          </p>

          {/* Recommended Careers */}
          <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Auto-Suggested Job Roles & Streams:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {(resultData?.recommendedCareers || STATIC_CAREERS.slice(0, 3)).map((c) => (
                <div key={c._id || Math.random()} style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-primary)' }}>{c.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{c.domain}</div>
                  <Link to="/user/careers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '0.75rem', textDecoration: 'none' }}>
                    View Full Roadmap <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={resetQuiz} className="btn-secondary">
              <RotateCcw size={16} /> Retake Interest Quiz
            </button>
            <Link to="/user/dashboard" className="btn-primary">
              Return to Passport Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

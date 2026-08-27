import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatWithPathSeeker, getPathSeekerHistory } from '../services/api';
import AIMessage from './AIMessage';
import './Chatbot.css';

const suggestions = [
  'What career suits my profile?',
  'Explain my latest quiz result',
  'Make me a practical roadmap',
  'Find resources for my next skill'
];

export default function Chatbot() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi${user?.name ? ` ${user.name.split(' ')[0]}` : ''}.\n\nI can help you understand your quiz results, explore careers, compare options, and build a practical path forward.` }
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    let active = true;
    getPathSeekerHistory()
      .then((response) => {
        if (active && response.messages?.length) setMessages(response.messages);
      })
      .catch(() => {
        // A new conversation can still be used if history is unavailable.
      });

    return () => {
      active = false;
    };
  }, [user?._id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!user) return null;

  const submit = async (event, suggestedMessage = '') => {
    event?.preventDefault();
    const message = (suggestedMessage || input).trim();
    if (!message || loading) return;
    setInput('');
    setMessages((current) => [...current, { role: 'user', content: message }]);
    setLoading(true);
    try {
      const response = await chatWithPathSeeker(message, location.pathname);
      setMessages((current) => [...current, { role: 'assistant', content: response.message }]);
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: error.message || 'I could not reach the copilot. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const continueAnswer = () => submit(undefined, 'Please continue your previous answer from the last section and complete it.');

  return (
    <div className="chatbot-root">
      {open && (
        <section className="chatbot-panel" aria-label="PathSeeker AI chat">
          <header className="chatbot-header">
            <div className="chatbot-title"><span className="chatbot-mark"><Sparkles size={17} /></span><span><strong>PathSeeker AI</strong><small>Your career copilot</small></span></div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat" title="Close chat"><X size={18} /></button>
          </header>
          <div className="chatbot-messages">
            {messages.map((item, index) => <div className={`chatbot-message ${item.role}`} key={`${item.role}-${index}`} role="article" aria-label={item.role === 'assistant' ? 'Assistant message' : 'Your message'}>{item.role === 'assistant' ? <AIMessage content={item.content} actions={item.actions} onContinue={loading ? undefined : continueAnswer} /> : <div className="user-message-content">{item.content}</div>}</div>)}
            {loading && <div className="chatbot-message assistant" role="status" aria-label="PathSeeker AI is thinking"><div className="ai-thinking"><span><Sparkles size={12} /> PathSeeker AI is thinking</span><div className="chatbot-typing"><i /><i /><i /></div></div></div>}
            <div ref={endRef} />
          </div>
          {messages.length === 1 && <div className="chatbot-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => submit(undefined, suggestion)}>{suggestion}</button>)}</div>}
          <form className="chatbot-composer" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your next move..." aria-label="Message PathSeeker AI" maxLength={2000} /><button type="submit" disabled={!input.trim() || loading} aria-label="Send message" title="Send message"><Send size={17} /></button></form>
        </section>
      )}
      <button className={`chatbot-launcher${open ? ' active' : ''}`} onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close PathSeeker AI' : 'Open PathSeeker AI'} title="Ask PathSeeker AI"><span>{open ? <X size={21} /> : <MessageCircle size={21} />}</span><strong>Ask PathSeeker</strong></button>
    </div>
  );
}
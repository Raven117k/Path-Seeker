import { Sparkles } from 'lucide-react';

function renderInline(text) {
  const tokens = text.split(/(\*\*[^*]+\*\*|(?<!\*)\*[^*]+\*(?!\*)|`[^`]+`|\[[^]]+\]\([^)]+\))/g).filter(Boolean);
  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return <code key={index}>{token.slice(1, -1)}</code>;
    }
    const link = token.match(/^\[([^]]+)\]\(([^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    }
    return token;
  });
}

function isUnorderedList(line) {
  return /^\s*(?:[-*+]\s+|•\s+)/.test(line);
}

function isOrderedList(line) {
  return /^\s*\d+[.)]\s+/.test(line);
}

function renderList(lines, ordered, key) {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag className={ordered ? 'ai-message-list ai-message-list-ordered' : 'ai-message-list'} key={key}>
    {lines.map((line, index) => {
        const content = ordered ? line.replace(/^\s*\d+[.)]\s+/, '') : line.replace(/^\s*(?:[-*+]\s+|•\s+)/, '');
      return <li key={`${key}-${index}`}><span>{renderInline(content)}</span></li>;
    })}
  </Tag>;
}

function renderBlocks(content) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let index = 0;
  let inCodeBlock = false;
  let codeLines = [];
  let previousHeading = '';

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        blocks.push(<pre key={`code-${index}`}><code>{codeLines.join('\n')}</code></pre>);
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      index += 1;
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      index += 1;
      continue;
    }
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      blocks.push(<hr key={`rule-${index}`} />);
      index += 1;
      continue;
    }
    const heading = line.match(/^\s*(#{1,4})\s+(.+?)\s*#*$/);
    if (heading) {
      const headingText = heading[2].trim();
      if (!headingText || headingText === previousHeading) {
        index += 1;
        continue;
      }
      const Tag = heading[1].length === 1 ? 'h3' : 'h4';
      blocks.push(<Tag key={`heading-${index}`}><span className="ai-heading-marker" /><span className="ai-heading-text">{renderInline(headingText)}</span></Tag>);
      previousHeading = headingText;
      index += 1;
      continue;
    }
    previousHeading = '';
    if (line.trim().startsWith('>')) {
      const quoteLines = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ''));
        index += 1;
      }
      blocks.push(<blockquote key={`quote-${index}`}><Sparkles size={14} aria-hidden="true" /><div>{quoteLines.map((quote, quoteIndex) => <p key={quoteIndex}>{renderInline(quote)}</p>)}</div></blockquote>);
      continue;
    }
    if (isUnorderedList(line) || isOrderedList(line)) {
      const ordered = isOrderedList(line);
      const listLines = [];
      while (index < lines.length && (ordered ? isOrderedList(lines[index]) : isUnorderedList(lines[index]))) {
        listLines.push(lines[index]);
        index += 1;
      }
      blocks.push(renderList(listLines, ordered, `list-${index}`));
      continue;
    }
    const paragraphLines = [];
    while (index < lines.length && lines[index].trim() && !/^\s*(#{1,4})\s+/.test(lines[index]) && !lines[index].trim().startsWith('>') && !isUnorderedList(lines[index]) && !isOrderedList(lines[index]) && !/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(lines[index])) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={`paragraph-${index}`}>{renderInline(paragraphLines.join(' '))}</p>);
  }

  if (inCodeBlock && codeLines.length > 0) {
    blocks.push(<pre key="code-unclosed"><code>{codeLines.join('\n')}</code></pre>);
  }

  return blocks;
}

export default function AIMessage({ content, actions = [], onAction, onContinue }) {
  const needsContinuation = /(?:^|\n)\s*#{1,4}\s+\S[^\n]*\s*$/.test(content.trim());
  const displayActions = needsContinuation && onContinue
    ? [...actions, { label: 'Continue answer', type: 'continue' }]
    : actions;

  return (
    <div className="ai-message-content" aria-label="PathSeeker AI response">
      <div className="ai-message-identity"><span><Sparkles size={12} aria-hidden="true" /></span><strong>PathSeeker AI</strong><small>Career copilot</small></div>
      <div className="ai-message-body">{renderBlocks(content)}</div>
      {displayActions.length > 0 && <div className="ai-message-actions">{displayActions.map((action) => <button key={action.label} type="button" onClick={() => action.type === 'continue' ? onContinue() : onAction?.(action)}>{action.label}</button>)}</div>}
    </div>
  );
}
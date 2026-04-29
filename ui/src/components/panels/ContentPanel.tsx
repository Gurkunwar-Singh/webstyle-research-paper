// ContentPanel.tsx - UPDATED (remove explicit JSX.Element type)
import React, { useState } from "react";

interface ContentPanelProps {
  content: string;
}

export default function ContentPanel({ content }: ContentPanelProps) {
  const [isRawVisible, setIsRawVisible] = useState(false);
  const lines = content?.split("\n").filter((l) => l.trim()) || [];

  // Remove ": JSX.Element | null" from this function
  const renderMarkdown = (line: string, i: number) => {
    if (line.startsWith("# ")) {
      return <h1 key={i} className="cnt-h1">{line.slice(2)}</h1>;
    }
    if (line.startsWith("## ")) {
      return <h2 key={i} className="cnt-h2">{line.slice(3)}</h2>;
    }
    if (line.startsWith("### ")) {
      return <h3 key={i} className="cnt-h3">{line.slice(4)}</h3>;
    }
    if (line.startsWith("- ")) {
      return <li key={i} className="cnt-li">{line.slice(2)}</li>;
    }
    if (line.match(/!\[.*\]\(.*\)/)) {
      const match = line.match(/!\[(.*?)\]\((.*?)\)/);
      return (
        <div key={i} className="cnt-image-placeholder">
          <span className="cnt-image-icon">🖼️</span>
          <span className="cnt-image-alt">{match?.[1] || "Image"}</span>
        </div>
      );
    }
    if (line.match(/\[.*\]\(.*\)/)) {
      const match = line.match(/\[(.*?)\]\((.*?)\)/);
      return (
        <p key={i} className="cnt-link">
          🔗 <a href={match?.[2]} target="_blank" rel="noopener noreferrer">{match?.[1]}</a>
        </p>
      );
    }
    if (line.trim() === "") return null;
    return <p key={i} className="cnt-p">{line}</p>;
  };

  // Remove ": JSX.Element[]" from this variable
  const groupedContent: any[] = [];
  let currentList: any[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("- ")) {
      currentList.push(<li key={i} className="cnt-li">{line.slice(2)}</li>);
    } else {
      if (currentList.length > 0) {
        groupedContent.push(<ul key={`list-${i}`} className="cnt-ul">{currentList}</ul>);
        currentList = [];
      }
      const rendered = renderMarkdown(line, i);
      if (rendered) groupedContent.push(rendered);
    }
  });
  
  if (currentList.length > 0) {
    groupedContent.push(<ul key="list-end" className="cnt-ul">{currentList}</ul>);
  }

  return (
    <div className="cnt-container">
      <div className="cnt-card">
        <div className="cnt-card-header">
          <span className="cnt-card-icon">📄</span>
          <h3 className="cnt-card-title">Extracted Content</h3>
          <span className="cnt-card-badge">{lines.length} lines</span>
        </div>
        <div className="cnt-content-preview">
          {groupedContent.length > 0 ? groupedContent : <div className="cnt-empty">No content extracted</div>}
        </div>
      </div>

      <div className="cnt-card">
        <div className="cnt-card-header">
          <span className="cnt-card-icon">ℹ️</span>
          <h3 className="cnt-card-title">Content Info</h3>
        </div>
        <div className="cnt-meta-grid">
          <div className="cnt-meta-item">
            <span className="cnt-meta-key">Total lines</span>
            <span className="cnt-meta-value">{lines.length}</span>
          </div>
          <div className="cnt-meta-item">
            <span className="cnt-meta-key">Characters</span>
            <span className="cnt-meta-value">{content?.length || 0}</span>
          </div>
          <div className="cnt-meta-item">
            <span className="cnt-meta-key">Words</span>
            <span className="cnt-meta-value">{content?.split(/\s+/).length || 0}</span>
          </div>
        </div>
      </div>

      <div className="cnt-card">
        <div className="cnt-card-header">
          <span className="cnt-card-icon">🔧</span>
          <h3 className="cnt-card-title">Raw Markdown</h3>
          <button className="cnt-toggle-btn" onClick={() => setIsRawVisible(!isRawVisible)}>
            {isRawVisible ? "Hide" : "Show"} raw content
          </button>
        </div>
        {isRawVisible && <pre className="cnt-raw-content">{content}</pre>}
      </div>

      <style>{`
        .cnt-container { display: flex; flex-direction: column; gap: 20px; }
        .cnt-card { background: #fff; border: 1px solid #e8e5df; border-radius: 16px; padding: 20px; }
        .cnt-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #f0eee8; }
        .cnt-card-icon { font-size: 20px; }
        .cnt-card-title { font-size: 15px; font-weight: 600; color: #1a1a1a; flex: 1; margin: 0; }
        .cnt-card-badge { font-size: 11px; background: #f0eee8; padding: 4px 10px; border-radius: 20px; color: #666; }
        .cnt-toggle-btn { background: none; border: 1px solid #e8e5df; padding: 4px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; }
        .cnt-toggle-btn:hover { background: #f0eee8; }
        .cnt-content-preview { max-height: 500px; overflow-y: auto; padding: 8px; }
        .cnt-h1 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 16px 0 8px; padding-bottom: 8px; border-bottom: 2px solid #6c5ce7; display: inline-block; }
        .cnt-h2 { font-size: 18px; font-weight: 600; color: #333; margin: 14px 0 6px; }
        .cnt-h3 { font-size: 15px; font-weight: 600; color: #555; margin: 12px 0 4px; }
        .cnt-p { font-size: 13px; line-height: 1.6; color: #666; margin-bottom: 8px; }
        .cnt-link { font-size: 13px; margin: 8px 0; }
        .cnt-link a { color: #6c5ce7; text-decoration: none; }
        .cnt-link a:hover { text-decoration: underline; }
        .cnt-ul { margin: 8px 0 8px 20px; padding: 0; }
        .cnt-li { font-size: 13px; color: #666; margin: 4px 0; }
        .cnt-image-placeholder { display: inline-flex; align-items: center; gap: 8px; background: #f0eee8; padding: 4px 12px; border-radius: 20px; margin: 8px 0; font-size: 12px; }
        .cnt-empty { text-align: center; padding: 40px; color: #aaa; }
        .cnt-meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .cnt-meta-item { text-align: center; padding: 12px; background: #faf9f6; border-radius: 10px; }
        .cnt-meta-key { display: block; font-size: 11px; color: #999; margin-bottom: 4px; }
        .cnt-meta-value { display: block; font-size: 24px; font-weight: 600; color: #6c5ce7; }
        .cnt-raw-content { background: #1a1a1a; color: #e0ddd8; padding: 16px; border-radius: 10px; font-size: 11px; font-family: 'DM Mono', monospace; overflow-x: auto; white-space: pre-wrap; max-height: 400px; overflow-y: auto; }
        @media (max-width: 500px) { .cnt-meta-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
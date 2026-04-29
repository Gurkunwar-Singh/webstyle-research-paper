// LayoutPanel.tsx
import React, { useState } from "react";
import { Style } from "../../types";

export default function LayoutPanel({ style }: { style: Style }) {
  const { layoutPatterns } = style;
  const [activePattern, setActivePattern] = useState<string | null>(null);

  const getPatternIcon = (name: string) => {
    switch (name) {
      case "grid": return "📐";
      case "flexbox": return "🧩";
      case "spacing": return "📏";
      default: return "🎨";
    }
  };

  const getPatternDescription = (name: string) => {
    switch (name) {
      case "grid":
        return "CSS Grid layout for two-dimensional positioning";
      case "flexbox":
        return "Flexbox for one-dimensional alignment and distribution";
      case "spacing":
        return "Margin and padding values for element spacing";
      default:
        return "Layout pattern detected on the page";
    }
  };

  const renderGridPreview = (props: any) => {
    const cols = props["grid-template-columns"] || props["gridTemplateColumns"];
    const gap = props["gap"] || props["grid-gap"];
    if (!cols) return null;
    const colCount = String(cols).split(" ").length;
    return (
      <div className="lay-preview-grid" style={{ gap: gap || "16px" }}>
        {Array.from({ length: Math.min(colCount * 2, 8) }).map((_, i) => (
          <div key={i} className="lay-preview-cell" />
        ))}
      </div>
    );
  };

  const renderFlexPreview = (props: any) => {
    const direction = props["flex-direction"] || props["flexDirection"];
    const justify = props["justify-content"] || props["justifyContent"];
    const align = props["align-items"] || props["alignItems"];
    return (
      <div
        className="lay-preview-flex"
        style={{
          flexDirection: direction === "column" ? "column" : "row",
          justifyContent: justify || "center",
          alignItems: align || "center",
        }}
      >
        <div className="lay-preview-flex-item" />
        <div className="lay-preview-flex-item" />
        <div className="lay-preview-flex-item" />
      </div>
    );
  };

  return (
    <div className="lay-container">
      {/* Pattern Cards */}
      <div className="lay-patterns-grid">
        {Object.entries(layoutPatterns || {}).map(([name, props]: [string, any]) => {
          const hasValues = Object.values(props || {}).some(
            (v: any) => v && v !== "0px" && v !== "initial" && v !== "auto"
          );
          if (!hasValues) return null;

          return (
            <div
              key={name}
              className={`lay-pattern-card ${activePattern === name ? "active" : ""}`}
              onMouseEnter={() => setActivePattern(name)}
              onMouseLeave={() => setActivePattern(null)}
            >
              <div className="lay-pattern-header">
                <span className="lay-pattern-icon">{getPatternIcon(name)}</span>
                <h3 className="lay-pattern-name">{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
                <span className="lay-pattern-badge">
                  {Object.keys(props).filter(k => props[k] && props[k] !== "0px").length} props
                </span>
              </div>

              <div className="lay-pattern-preview">
                {name === "grid" && renderGridPreview(props)}
                {name === "flexbox" && renderFlexPreview(props)}
                {name === "spacing" && (
                  <div className="lay-preview-spacing">
                    <div className="lay-spacing-box">
                      <div className="lay-spacing-inner">content</div>
                      {props["margin"] && props["margin"] !== "0px" && (
                        <span className="lay-spacing-label margin">margin</span>
                      )}
                      {props["padding"] && props["padding"] !== "0px" && (
                        <span className="lay-spacing-label padding">padding</span>
                      )}
                    </div>
                  </div>
                )}
                {!["grid", "flexbox", "spacing"].includes(name) && (
                  <div className="lay-preview-generic">📐 Layout detected</div>
                )}
              </div>

              <div className="lay-pattern-props">
                {Object.entries(props)
                  .filter(([, v]: any) => v && v !== "0px" && v !== "initial" && v !== "auto")
                  .slice(0, 6)
                  .map(([k, v]: [string, any]) => (
                    <div key={k} className="lay-prop">
                      <span className="lay-prop-key">{k}</span>
                      <span className="lay-prop-value">{String(v)}</span>
                    </div>
                  ))}
              </div>

              <div className="lay-pattern-desc">{getPatternDescription(name)}</div>
            </div>
          );
        })}
      </div>

      {/* Visual Guide Card */}
      <div className="lay-card">
        <div className="lay-card-header">
          <span className="lay-card-icon">🎯</span>
          <h3 className="lay-card-title">Layout Visual Guide</h3>
          <span className="lay-card-badge">Interactive preview</span>
        </div>
        <div className="lay-guide">
          <p className="lay-guide-text">
            Hover over any pattern card above to see a live preview of how the layout behaves.
            The extracted values show the actual CSS properties used on the page.
          </p>
          <div className="lay-guide-tips">
            <div className="lay-tip">
              <span className="lay-tip-icon">📐</span>
              <span>Grid layouts show column structure</span>
            </div>
            <div className="lay-tip">
              <span className="lay-tip-icon">🧩</span>
              <span>Flexbox shows alignment and direction</span>
            </div>
            <div className="lay-tip">
              <span className="lay-tip-icon">📏</span>
              <span>Spacing shows margin/padding relationships</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lay-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .lay-card {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 16px;
          padding: 20px;
        }
        .lay-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0eee8;
        }
        .lay-card-icon { font-size: 20px; }
        .lay-card-title { font-size: 15px; font-weight: 600; color: #1a1a1a; flex: 1; margin: 0; }
        .lay-card-badge { font-size: 11px; background: #f0eee8; padding: 4px 10px; border-radius: 20px; color: #666; }
        .lay-patterns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        .lay-pattern-card {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 16px;
          padding: 18px;
          transition: all 0.2s ease;
        }
        .lay-pattern-card:hover,
        .lay-pattern-card.active {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0,0,0,0.1);
          border-color: #6c5ce7;
        }
        .lay-pattern-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .lay-pattern-icon { font-size: 24px; }
        .lay-pattern-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          flex: 1;
          margin: 0;
        }
        .lay-pattern-badge {
          font-size: 10px;
          background: #f0eee8;
          padding: 2px 8px;
          border-radius: 12px;
          color: #888;
        }
        .lay-pattern-preview {
          background: #faf9f6;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 14px;
          min-height: 100px;
        }
        .lay-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          gap: 8px;
        }
        .lay-preview-cell {
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          border-radius: 8px;
          aspect-ratio: 1;
          opacity: 0.8;
        }
        .lay-preview-flex {
          display: flex;
          gap: 12px;
          min-height: 80px;
        }
        .lay-preview-flex-item {
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          border-radius: 8px;
          width: 50px;
          height: 50px;
          opacity: 0.8;
        }
        .lay-preview-spacing {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
        }
        .lay-spacing-box {
          position: relative;
          background: #e8e5df;
          padding: 16px 24px;
          border-radius: 8px;
        }
        .lay-spacing-inner {
          background: #6c5ce7;
          color: #fff;
          padding: 12px 20px;
          border-radius: 6px;
          font-size: 12px;
        }
        .lay-spacing-label {
          position: absolute;
          font-size: 9px;
          color: #888;
          background: #fff;
          padding: 2px 6px;
          border-radius: 10px;
          white-space: nowrap;
        }
        .lay-spacing-label.margin { top: -20px; left: 50%; transform: translateX(-50%); }
        .lay-spacing-label.padding { bottom: -20px; left: 50%; transform: translateX(-50%); }
        .lay-preview-generic {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 80px;
          font-size: 24px;
          color: #aaa;
        }
        .lay-pattern-props {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }
        .lay-prop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          padding: 4px 0;
          border-bottom: 1px dashed #f0eee8;
        }
        .lay-prop-key {
          color: #999;
          text-transform: capitalize;
        }
        .lay-prop-value {
          color: #6c5ce7;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
        }
        .lay-pattern-desc {
          font-size: 11px;
          color: #aaa;
          padding-top: 8px;
          border-top: 1px solid #f0eee8;
        }
        .lay-guide-text {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .lay-guide-tips {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .lay-tip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #555;
          background: #faf9f6;
          padding: 8px 14px;
          border-radius: 30px;
        }
        .lay-tip-icon { font-size: 16px; }
        @media (max-width: 700px) {
          .lay-patterns-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
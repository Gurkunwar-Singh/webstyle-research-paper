// TypographyPanel.tsx
import React from "react";
import { Style } from "../../types";

export default function TypographyPanel({ style }: { style: Style }) {
  const { typography } = style;
  const sizes = [...(typography?.fontSizes || [])].sort((a, b) => b - a);
  const sampleTexts: Record<number, string> = {
    48: "Display Title",
    36: "Hero Heading",
    30: "Section Heading",
    24: "Card Title",
    20: "Subheading",
    18: "Lead Text",
    16: "Body Text",
    14: "Small Text",
    12: "Caption",
  };

  return (
    <div className="typ-container">
      {/* Primary Typeface Card */}
      <div className="typ-card typ-card-hero">
        <div className="typ-card-header">
          <span className="typ-card-icon">🔤</span>
          <h3 className="typ-card-title">Primary Typeface</h3>
        </div>
        <div className="typ-type-preview">
          <div className="typ-type-sample">Aa</div>
          <div className="typ-type-identity">
            <div className="typ-type-family">{typography?.primaryFontFamily || "—"}</div>
            <div className="typ-type-meta">
              <span className="typ-meta-tag">Weight: {typography?.primaryFontWeight || "—"}</span>
              <span className="typ-meta-tag">
                Scale: {typography?.scale ? `${typography.scale}× modular` : "—"}
              </span>
              <span className="typ-meta-tag">Base: {typography?.baseFontSize || "—"}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Font Size Statistics */}
      <div className="typ-grid-3">
        <div className="typ-stat-card">
          <div className="typ-stat-value">{sizes.length}</div>
          <div className="typ-stat-label">Font Sizes</div>
          <div className="typ-stat-desc">Distinct sizes detected</div>
        </div>
        <div className="typ-stat-card">
          <div className="typ-stat-value">{Math.min(...sizes)}px</div>
          <div className="typ-stat-label">Smallest</div>
          <div className="typ-stat-desc">Minimum font size</div>
        </div>
        <div className="typ-stat-card">
          <div className="typ-stat-value">{Math.max(...sizes)}px</div>
          <div className="typ-stat-label">Largest</div>
          <div className="typ-stat-desc">Maximum font size</div>
        </div>
      </div>

      {/* Type Scale Preview */}
      <div className="typ-card">
        <div className="typ-card-header">
          <span className="typ-card-icon">📏</span>
          <h3 className="typ-card-title">Type Scale</h3>
          <span className="typ-card-badge">Modular scale preview</span>
        </div>
        <div className="typ-scale-list">
          {sizes.slice(0, 12).map((size: number) => (
            <div key={size} className="typ-scale-row">
              <div className="typ-scale-marker">
                <span className="typ-scale-size">{size}px</span>
                <div className="typ-scale-line" style={{ width: `${Math.min(60, size / 1.5)}px` }} />
              </div>
              <div
                className="typ-scale-sample"
                style={{
                  fontSize: Math.min(size, 42),
                  fontWeight: size >= 24 ? 600 : 400,
                }}
              >
                {sampleTexts[size] || `${size}px Text`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Usage Preview */}
      <div className="typ-card">
        <div className="typ-card-header">
          <span className="typ-card-icon">📝</span>
          <h3 className="typ-card-title">Live Preview</h3>
          <span className="typ-card-badge">With your font</span>
        </div>
        <div className="typ-live-preview">
          <div
            className="typ-preview-block"
            style={{ fontFamily: typography?.primaryFontFamily }}
          >
            <p className="typ-preview-paragraph">
              The quick brown fox jumps over the lazy dog. This is a sample text
              to demonstrate how the extracted typeface renders on screen.
            </p>
            <p className="typ-preview-paragraph">
              <strong>Bold text</strong> and <em>italic text</em> styling are
              also shown to give you a complete picture of the typographic
              system.
            </p>
            <div className="typ-preview-links">
              <a href="#" className="typ-preview-link">Link example</a>
              <span className="typ-preview-sep">·</span>
              <a href="#" className="typ-preview-link">Another link</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .typ-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .typ-card {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 16px;
          padding: 20px;
        }
        .typ-card-hero {
          background: linear-gradient(135deg, #fff 0%, #faf9f6 100%);
        }
        .typ-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0eee8;
        }
        .typ-card-icon { font-size: 20px; }
        .typ-card-title { font-size: 15px; font-weight: 600; color: #1a1a1a; flex: 1; margin: 0; }
        .typ-card-badge { font-size: 11px; background: #f0eee8; padding: 4px 10px; border-radius: 20px; color: #666; }
        .typ-type-preview {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .typ-type-sample {
          font-size: 72px;
          font-weight: 600;
          font-family: inherit;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .typ-type-identity { flex: 1; }
        .typ-type-family {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 6px;
        }
        .typ-type-meta { display: flex; gap: 12px; flex-wrap: wrap; }
        .typ-meta-tag {
          font-size: 11px;
          color: #888;
          background: #f0eee8;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .typ-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .typ-stat-card {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }
        .typ-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #6c5ce7;
          letter-spacing: -0.02em;
        }
        .typ-stat-label {
          font-size: 12px;
          font-weight: 500;
          color: #333;
          margin-top: 4px;
        }
        .typ-stat-desc {
          font-size: 10px;
          color: #aaa;
          margin-top: 2px;
        }
        .typ-scale-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .typ-scale-row {
          display: flex;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
        }
        .typ-scale-marker {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100px;
          flex-shrink: 0;
        }
        .typ-scale-size {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: #6c5ce7;
          font-weight: 500;
          width: 40px;
        }
        .typ-scale-line {
          height: 2px;
          background: linear-gradient(90deg, #6c5ce7, #a29bfe);
          border-radius: 2px;
        }
        .typ-scale-sample {
          color: #1a1a1a;
          line-height: 1.3;
          flex: 1;
        }
        .typ-live-preview {
          font-family: inherit;
        }
        .typ-preview-block {
          padding: 16px;
          background: #faf9f6;
          border-radius: 12px;
        }
        .typ-preview-paragraph {
          font-size: 16px;
          line-height: 1.6;
          color: #444;
          margin-bottom: 12px;
        }
        .typ-preview-links {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .typ-preview-link {
          color: #6c5ce7;
          text-decoration: none;
          font-size: 14px;
        }
        .typ-preview-link:hover { text-decoration: underline; }
        .typ-preview-sep { color: #ddd; }
        @media (max-width: 500px) {
          .typ-type-sample { font-size: 48px; }
          .typ-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
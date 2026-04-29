// ColorsPanel.tsx
import React from "react";
import { Style } from "../../types";
import { colorToHex, formatColor } from "../../utils/helpers";

export default function ColorsPanel({ style }: { style: Style }) {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="clp-container">
      {/* Dominant Palette */}
      <div className="clp-card">
        <div className="clp-card-header">
          <span className="clp-card-icon">🎨</span>
          <h3 className="clp-card-title">Dominant Palette</h3>
          <span className="clp-card-badge">K-means clustering</span>
        </div>
        <div className="clp-palette-grid">
          {(style.colorPalette || []).map((c: string, i: number) => (
            <div
              key={i}
              className="clp-palette-item"
              onClick={() => copyToClipboard(c)}
              role="button"
              tabIndex={0}
            >
              <div className="clp-palette-swatch" style={{ background: c }} />
              <div className="clp-palette-info">
                <div className="clp-palette-hex">{colorToHex(c)}</div>
                <div className="clp-palette-raw">{formatColor(c)}</div>
              </div>
              {copiedColor === c && (
                <div className="clp-copied-tooltip">Copied!</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Theme Colors */}
      <div className="clp-card">
        <div className="clp-card-header">
          <span className="clp-card-icon">🎯</span>
          <h3 className="clp-card-title">Semantic Colors</h3>
          <span className="clp-card-badge">By zone</span>
        </div>
        <div className="clp-semantic-grid">
          {Object.entries(style.semanticTheme || {})
            .filter(([, v]: any) => Object.keys(v).length > 0)
            .map(([zone, props]: [string, any]) => {
              const colorProps = Object.entries(props).filter(
                ([k]) => k.includes("color") || k.includes("background")
              );
              if (colorProps.length === 0) return null;
              return (
                <div key={zone} className="clp-semantic-card">
                  <div className="clp-semantic-header">
                    <span className="clp-semantic-icon">
                      {zone === "primary" && "🔵"}
                      {zone === "navigation" && "🧭"}
                      {zone === "buttons" && "🔘"}
                      {zone === "links" && "🔗"}
                      {zone === "headings" && "📝"}
                      {!["primary", "navigation", "buttons", "links", "headings"].includes(zone) && "🎨"}
                    </span>
                    <span className="clp-semantic-name">{zone}</span>
                  </div>
                  <div className="clp-semantic-colors">
                    {colorProps.map(([k, v]: [string, any]) => (
                      <div
                        key={k}
                        className="clp-semantic-color"
                        onClick={() => copyToClipboard(v)}
                      >
                        <div className="clp-semantic-swatch" style={{ background: v }} />
                        <div className="clp-semantic-color-info">
                          <span className="clp-semantic-prop">{k}</span>
                          <span className="clp-semantic-value">{formatColor(v)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Color Contrast Quick View */}
      {style.accessibility?.accessibleColorPairs?.length > 0 && (
        <div className="clp-card">
          <div className="clp-card-header">
            <span className="clp-card-icon">⚡</span>
            <h3 className="clp-card-title">High Contrast Pairs</h3>
            <span className="clp-card-badge">WCAG ≥ 4.5</span>
          </div>
          <div className="clp-contrast-preview">
            {style.accessibility.accessibleColorPairs.slice(0, 6).map((pair: any, i: number) => (
              <div key={i} className="clp-contrast-item">
                <div className="clp-contrast-swatches">
                  <div className="clp-contrast-swatch" style={{ background: pair.background }} />
                  <span className="clp-contrast-arrow">→</span>
                  <div className="clp-contrast-swatch" style={{ background: pair.foreground }} />
                </div>
                <div className="clp-contrast-info">
                  <span className="clp-contrast-ratio">{Math.round(pair.contrast * 10) / 10}:1</span>
                  <span className="clp-contrast-element">{pair.element}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .clp-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .clp-card {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 16px;
          padding: 20px;
        }
        .clp-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0eee8;
        }
        .clp-card-icon { font-size: 20px; }
        .clp-card-title { font-size: 15px; font-weight: 600; color: #1a1a1a; flex: 1; margin: 0; }
        .clp-card-badge { font-size: 11px; background: #f0eee8; padding: 4px 10px; border-radius: 20px; color: #666; }
        .clp-palette-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        .clp-palette-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #faf9f6;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
        }
        .clp-palette-item:hover {
          background: #f0eee8;
          transform: scale(1.02);
        }
        .clp-palette-swatch {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          border: 1px solid #e8e5df;
          flex-shrink: 0;
        }
        .clp-palette-info { flex: 1; min-width: 0; }
        .clp-palette-hex {
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Mono', monospace;
          color: #1a1a1a;
        }
        .clp-palette-raw {
          font-size: 10px;
          color: #aaa;
          font-family: 'DM Mono', monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .clp-copied-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a1a;
          color: #fff;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }
        .clp-semantic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .clp-semantic-card {
          background: #faf9f6;
          border: 1px solid #ece9e2;
          border-radius: 12px;
          padding: 14px;
        }
        .clp-semantic-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ece9e2;
        }
        .clp-semantic-icon { font-size: 16px; }
        .clp-semantic-name {
          font-size: 13px;
          font-weight: 600;
          text-transform: capitalize;
          color: #333;
        }
        .clp-semantic-colors { display: flex; flex-direction: column; gap: 8px; }
        .clp-semantic-color {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.1s;
        }
        .clp-semantic-color:hover { background: #f0eee8; }
        .clp-semantic-swatch {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #e8e5df;
          flex-shrink: 0;
        }
        .clp-semantic-color-info { flex: 1; display: flex; justify-content: space-between; align-items: center; }
        .clp-semantic-prop { font-size: 10px; color: #999; text-transform: capitalize; }
        .clp-semantic-value { font-size: 10px; font-family: 'DM Mono', monospace; color: #555; }
        .clp-contrast-preview { display: flex; flex-wrap: wrap; gap: 12px; }
        .clp-contrast-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: #faf9f6;
          border-radius: 10px;
        }
        .clp-contrast-swatches { display: flex; align-items: center; gap: 6px; }
        .clp-contrast-swatch { width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e8e5df; }
        .clp-contrast-arrow { font-size: 12px; color: #ccc; }
        .clp-contrast-info { display: flex; flex-direction: column; }
        .clp-contrast-ratio { font-size: 13px; font-weight: 600; color: #1a1a1a; }
        .clp-contrast-element { font-size: 10px; color: #aaa; }
      `}</style>
    </div>
  );
}
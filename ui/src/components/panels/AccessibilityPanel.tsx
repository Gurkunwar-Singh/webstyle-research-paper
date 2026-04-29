// AccessibilityPanel.tsx (fixed)
import React from "react";
import { Style } from "../../types";
import { wcagLabel } from "../../utils/helpers";

interface ColorPair {
  background: string;
  foreground: string;
  contrast: number;
  element: string;
}

interface AccessibilityData {
  accessibleColorPairs: ColorPair[];
  averageContrast: number;
}

export default function AccessibilityPanel({ style }: { style: Style }) {
  const accessibility = style?.accessibility as AccessibilityData;
  const avg = accessibility?.averageContrast || 0;
  const lbl = avg ? wcagLabel(avg) : { text: "—", cls: "" };
  const pairs = accessibility?.accessibleColorPairs || [];

  const getScoreClass = (contrast: number) => {
    if (contrast >= 12) return "excellent";
    if (contrast >= 7) return "good";
    if (contrast >= 4.5) return "pass";
    return "fail";
  };

  return (
    <div className="acc-container">
      <div className="acc-grid-3">
        <div className="acc-stat-card">
          <div className="acc-stat-icon">🎯</div>
          <div className={`acc-stat-value ${avg >= 7 ? "success" : avg >= 4.5 ? "warning" : "danger"}`}>
            {Math.round(avg * 10) / 10}:1
          </div>
          <div className="acc-stat-label">Average Contrast</div>
          <div className={`acc-stat-badge ${lbl.cls}`}>{lbl.text}</div>
        </div>
        <div className="acc-stat-card">
          <div className="acc-stat-icon">✅</div>
          <div className="acc-stat-value">{pairs.length}</div>
          <div className="acc-stat-label">Passing Pairs</div>
          <div className="acc-stat-desc">WCAG ≥ 4.5:1</div>
        </div>
        <div className="acc-stat-card">
          <div className="acc-stat-icon">📊</div>
          <div className="acc-stat-value">
            {pairs.length ? Math.round((pairs.filter((p: ColorPair) => p.contrast >= 7).length / pairs.length) * 100) : 0}%
          </div>
          <div className="acc-stat-label">AAA Compliance</div>
          <div className="acc-stat-desc">Contrast ≥ 7:1</div>
        </div>
      </div>

      <div className="acc-card">
        <div className="acc-card-header">
          <span className="acc-card-icon">🎨</span>
          <h3 className="acc-card-title">Color Contrast Analysis</h3>
          <span className="acc-card-badge">{pairs.length} pairs</span>
        </div>
        <div className="acc-pairs-list">
          {pairs.length === 0 ? (
            <div className="acc-empty">No accessible color pairs detected</div>
          ) : (
            pairs.map((pair: ColorPair, i: number) => {
              const level = wcagLabel(pair.contrast);
              const scoreClass = getScoreClass(pair.contrast);
              return (
                <div key={i} className={`acc-pair ${scoreClass}`}>
                  <div className="acc-pair-swatches">
                    <div className="acc-pair-swatch" style={{ background: pair.background }}>
                      <span className="acc-swatch-label">BG</span>
                    </div>
                    <div className="acc-pair-arrow">→</div>
                    <div className="acc-pair-swatch" style={{ background: pair.foreground }}>
                      <span className="acc-swatch-label">FG</span>
                    </div>
                  </div>
                  <div className="acc-pair-info">
                    <code className="acc-pair-element">{pair.element}</code>
                    <div className="acc-pair-stats">
                      <span className="acc-pair-contrast">{Math.round(pair.contrast * 10) / 10}:1</span>
                      <span className={`acc-pair-badge ${level.cls}`}>{level.text}</span>
                    </div>
                  </div>
                  <div className="acc-pair-preview">
                    <span style={{ color: pair.foreground, background: pair.background, padding: "4px 8px", borderRadius: "6px", display: "inline-block" }}>
                      Sample
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="acc-card">
        <div className="acc-card-header">
          <span className="acc-card-icon">💡</span>
          <h3 className="acc-card-title">Recommendations</h3>
          <span className="acc-card-badge">Based on analysis</span>
        </div>
        <div className="acc-recommendations">
          {avg < 4.5 && avg > 0 && (
            <div className="acc-rec warning">⚠️ Average contrast is below WCAG AA standard (4.5:1). Consider adjusting text or background colors.</div>
          )}
          {avg >= 4.5 && avg < 7 && avg > 0 && (
            <div className="acc-rec info">✓ Average contrast meets AA standards. Aim for AAA (7:1) where possible for better accessibility.</div>
          )}
          {avg >= 7 && (
            <div className="acc-rec success">🎉 Great! Your average contrast meets AAA standards, ensuring excellent readability.</div>
          )}
          {pairs.length === 0 && (
            <div className="acc-rec warning">⚠️ No WCAG-compliant color pairs detected. Review your color scheme for better accessibility.</div>
          )}
          <div className="acc-rec tip">
            <strong>💡 Pro tip:</strong> Use tools like Stark or Contrast to test color combinations during design.
          </div>
        </div>
      </div>

      <style>{`
        .acc-container { display: flex; flex-direction: column; gap: 20px; }
        .acc-card { background: #fff; border: 1px solid #e8e5df; border-radius: 16px; padding: 20px; }
        .acc-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #f0eee8; }
        .acc-card-icon { font-size: 20px; }
        .acc-card-title { font-size: 15px; font-weight: 600; color: #1a1a1a; flex: 1; margin: 0; }
        .acc-card-badge { font-size: 11px; background: #f0eee8; padding: 4px 10px; border-radius: 20px; color: #666; }
        .acc-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .acc-stat-card { background: #fff; border: 1px solid #e8e5df; border-radius: 12px; padding: 16px; text-align: center; }
        .acc-stat-icon { font-size: 24px; margin-bottom: 8px; }
        .acc-stat-value { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; }
        .acc-stat-value.success { color: #00b894; }
        .acc-stat-value.warning { color: #f39c12; }
        .acc-stat-value.danger { color: #e74c3c; }
        .acc-stat-label { font-size: 12px; font-weight: 500; color: #333; margin-top: 4px; }
        .acc-stat-desc { font-size: 10px; color: #aaa; margin-top: 2px; }
        .acc-stat-badge { display: inline-block; margin-top: 8px; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 500; }
        .badge-aaa { background: #d4f5e8; color: #00614a; }
        .badge-aa { background: #ddf1fd; color: #0a5f92; }
        .badge-fail { background: #ffe0df; color: #922; }
        .acc-pairs-list { display: flex; flex-direction: column; gap: 12px; }
        .acc-pair { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 12px; background: #faf9f6; border-radius: 12px; }
        .acc-pair.excellent { border-left: 3px solid #00b894; }
        .acc-pair.good { border-left: 3px solid #6c5ce7; }
        .acc-pair.pass { border-left: 3px solid #f39c12; }
        .acc-pair.fail { border-left: 3px solid #e74c3c; }
        .acc-pair-swatches { display: flex; align-items: center; gap: 8px; }
        .acc-pair-swatch { width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #e8e5df; }
        .acc-swatch-label { font-size: 10px; font-weight: 600; mix-blend-mode: difference; }
        .acc-pair-arrow { color: #ccc; }
        .acc-pair-info { flex: 1; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
        .acc-pair-element { font-size: 11px; font-family: 'DM Mono', monospace; background: #fff; padding: 4px 8px; border-radius: 6px; color: #555; }
        .acc-pair-stats { display: flex; gap: 8px; align-items: center; }
        .acc-pair-contrast { font-size: 13px; font-weight: 600; color: #1a1a1a; }
        .acc-pair-badge { font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 12px; }
        .acc-pair-preview { flex-shrink: 0; }
        .acc-empty { text-align: center; padding: 40px; color: #aaa; }
        .acc-recommendations { display: flex; flex-direction: column; gap: 10px; }
        .acc-rec { padding: 12px 16px; border-radius: 10px; font-size: 13px; line-height: 1.5; }
        .acc-rec.warning { background: #fff8e7; border-left: 3px solid #f39c12; color: #8a6d0c; }
        .acc-rec.info { background: #e8f4fd; border-left: 3px solid #3498db; color: #1a5276; }
        .acc-rec.success { background: #e0fdf4; border-left: 3px solid #00b894; color: #00614a; }
        .acc-rec.tip { background: #f0eee8; border-left: 3px solid #6c5ce7; color: #444; }
        @media (max-width: 600px) {
          .acc-grid-3 { grid-template-columns: 1fr; }
          .acc-pair { flex-direction: column; align-items: stretch; }
          .acc-pair-preview { text-align: center; }
        }
      `}</style>
    </div>
  );
}
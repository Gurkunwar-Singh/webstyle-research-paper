// OverviewPanel.tsx
import React from "react";
import { Style } from "../../types";
import { formatColor } from "../../utils/helpers";

export default function OverviewPanel({ style }: { style: Style }) {
  return (
    <div className="ovp-container">
      {/* Color Palette Card */}
      <div className="ovp-card">
        <div className="ovp-card-header">
          <span className="ovp-card-icon">🎨</span>
          <h3 className="ovp-card-title">Color Palette</h3>
          <span className="ovp-card-badge">{style.colorPalette?.length || 0} colors</span>
        </div>
        <div className="ovp-swatches">
          {(style.colorPalette || []).map((c: string, i: number) => (
            <div key={i} className="ovp-swatch-group">
              <div className="ovp-swatch" style={{ background: c }} />
              <div className="ovp-swatch-info">
                <span className="ovp-swatch-value">{formatColor(c)}</span>
                <span className="ovp-swatch-index">#{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Hierarchy Card */}
      <div className="ovp-card">
        <div className="ovp-card-header">
          <span className="ovp-card-icon">📊</span>
          <h3 className="ovp-card-title">Visual Hierarchy</h3>
          <span className="ovp-card-badge">Top elements</span>
        </div>
        <div className="ovp-hierarchy">
          {(style.visualHierarchy || []).slice(0, 8).map((el: any, i: number) => (
            <div key={i} className="ovp-hierarchy-item">
              <div className="ovp-hierarchy-header">
                <div className="ovp-hierarchy-selector-wrap">
                  <span className="ovp-hierarchy-rank">#{i + 1}</span>
                  <code className="ovp-hierarchy-selector">{el.selector}</code>
                </div>
                <span className="ovp-hierarchy-weight">{Math.round(el.weight * 100)}%</span>
              </div>
              <div className="ovp-progress-bar">
                <div
                  className="ovp-progress-fill"
                  style={{ width: `${Math.min(100, Math.round(el.weight * 100))}%` }}
                />
              </div>
              <div className="ovp-hierarchy-styles">
                {el.styles?.fontSize && (
                  <span className="ovp-style-tag">📏 {el.styles.fontSize}</span>
                )}
                {el.styles?.fontFamily && (
                  <span className="ovp-style-tag">🔤 {el.styles.fontFamily.split(",")[0]}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Theme Zones Card */}
      <div className="ovp-card ovp-card-full">
        <div className="ovp-card-header">
          <span className="ovp-card-icon">🏷️</span>
          <h3 className="ovp-card-title">Semantic Theme Zones</h3>
          <span className="ovp-card-badge">
            {Object.keys(style.semanticTheme || {}).filter(k => Object.keys(style.semanticTheme[k] || {}).length).length} zones
          </span>
        </div>
        <div className="ovp-zones">
          {Object.entries(style.semanticTheme || {})
            .filter(([, v]: any) => Object.keys(v).length > 0)
            .map(([zone, props]: [string, any]) => (
              <div key={zone} className="ovp-zone">
                <div className="ovp-zone-header">
                  <span className="ovp-zone-icon">
                    {zone === "primary" && "🎯"}
                    {zone === "navigation" && "🧭"}
                    {zone === "header" && "📌"}
                    {zone === "footer" && "📎"}
                    {zone === "buttons" && "🔘"}
                    {zone === "links" && "🔗"}
                    {zone === "headings" && "📝"}
                    {!["primary", "navigation", "header", "footer", "buttons", "links", "headings"].includes(zone) && "📦"}
                  </span>
                  <span className="ovp-zone-name">{zone}</span>
                </div>
                <div className="ovp-zone-props">
                  {Object.entries(props).slice(0, 5).map(([k, v]: [string, any]) => (
                    <div key={k} className="ovp-zone-prop">
                      <span className="ovp-prop-key">{k}</span>
                      <div className="ovp-prop-value-wrap">
                        {(k.includes("color") || k.includes("background")) && (
                          <div className="ovp-prop-dot" style={{ background: v }} />
                        )}
                        <span className="ovp-prop-value">{formatColor(v)}</span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(props).length > 5 && (
                    <div className="ovp-zone-more">+{Object.keys(props).length - 5} more</div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <style>{`
        .ovp-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ovp-card {
          background: #fff;
          border: 1px solid #e8e5df;
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s ease;
        }
        .ovp-card:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }
        .ovp-card-full {
          grid-column: 1 / -1;
        }
        .ovp-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0eee8;
        }
        .ovp-card-icon {
          font-size: 20px;
        }
        .ovp-card-title {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          flex: 1;
        }
        .ovp-card-badge {
          font-size: 11px;
          background: #f0eee8;
          padding: 4px 10px;
          border-radius: 20px;
          color: #666;
        }
        .ovp-swatches {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 12px;
        }
        .ovp-swatch-group {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: #faf9f6;
          border-radius: 10px;
          transition: transform 0.15s;
        }
        .ovp-swatch-group:hover {
          transform: translateX(4px);
        }
        .ovp-swatch {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          border: 1px solid #e8e5df;
          flex-shrink: 0;
        }
        .ovp-swatch-info {
          flex: 1;
          min-width: 0;
        }
        .ovp-swatch-value {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: #555;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ovp-swatch-index {
          font-size: 9px;
          color: #bbb;
        }
        .ovp-hierarchy {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ovp-hierarchy-item {
          padding: 8px 0;
        }
        .ovp-hierarchy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .ovp-hierarchy-selector-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ovp-hierarchy-rank {
          font-size: 11px;
          font-weight: 600;
          color: #6c5ce7;
          background: #f0eee8;
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        .ovp-hierarchy-selector {
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          background: #f5f4f0;
          padding: 4px 8px;
          border-radius: 6px;
          color: #555;
        }
        .ovp-hierarchy-weight {
          font-size: 13px;
          font-weight: 600;
          color: #6c5ce7;
        }
        .ovp-progress-bar {
          height: 6px;
          background: #f0eee8;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .ovp-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6c5ce7, #a29bfe);
          border-radius: 3px;
          transition: width 0.5s ease;
        }
        .ovp-hierarchy-styles {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .ovp-style-tag {
          font-size: 10px;
          color: #aaa;
          background: #fff;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1px solid #e8e5df;
        }
        .ovp-zones {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
        }
        .ovp-zone {
          background: #faf9f6;
          border: 1px solid #ece9e2;
          border-radius: 12px;
          padding: 14px;
          transition: all 0.15s;
        }
        .ovp-zone:hover {
          border-color: #ddd8cf;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .ovp-zone-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ece9e2;
        }
        .ovp-zone-icon {
          font-size: 14px;
        }
        .ovp-zone-name {
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
          color: #333;
        }
        .ovp-zone-props {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ovp-zone-prop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
        }
        .ovp-prop-key {
          color: #999;
          font-size: 10px;
        }
        .ovp-prop-value-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ovp-prop-dot {
          width: 10px;
          height: 10px;
          border-radius: 3px;
          border: 1px solid #e8e5df;
        }
        .ovp-prop-value {
          color: #555;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ovp-zone-more {
          font-size: 10px;
          color: #6c5ce7;
          margin-top: 4px;
          text-align: center;
        }
        @media (max-width: 600px) {
          .ovp-swatches { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
          .ovp-zones { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
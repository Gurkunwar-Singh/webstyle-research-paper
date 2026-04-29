// types/index.ts (update your Style type)
export interface Style {
  colorPalette: string[];
  semanticTheme: Record<string, Record<string, string>>;
  visualHierarchy: Array<{
    selector: string;
    weight: number;
    styles: Record<string, string>;
  }>;
  brandColors: string[];
  cssFramework: { framework: string };
  typography: {
    scale: number;
    baseFontSize: number;
    fontSizes: number[];
    primaryFontFamily: string;
    primaryFontWeight: string;
  };
  accessibility: {
    accessibleColorPairs: Array<{
      background: string;
      foreground: string;
      contrast: number;
      element: string;
    }>;
    averageContrast: number;
  };
  layoutPatterns: Record<string, Record<string, string>>;
  metadata: {
    title: string;
    url: string;
    extractedAt: string;
  };
}

export interface ApiResponse {
  style: Style;
  content: string;
  debugPort?: number;
}
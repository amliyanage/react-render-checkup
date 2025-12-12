export interface RenderInfo {
  componentName: string;
  renderCount: number;
  timestamp: number;
  changedProps: PropChange[];
  causeTree: CauseNode | null;
}

export interface PropChange {
  propName: string;
  previousValue: any;
  currentValue: any;
  isUnstable: boolean;
}

export interface CauseNode {
  componentName: string;
  propName: string;
  reason: string;
  parent: CauseNode | null;
  children: CauseNode[];
}

export interface CheckupOptions {
  enabled?: boolean;
  logToConsole?: boolean;
  trackCauseTree?: boolean;
  onRender?: (info: RenderInfo) => void;
  includeValues?: boolean;
}

export interface MemoizationSuggestion {
  type: "useCallback" | "useMemo" | "React.memo";
  reason: string;
  propName?: string;
  confidence: "high" | "medium" | "low";
}

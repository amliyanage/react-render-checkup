import { RenderInfo, CauseNode } from "./types";

class RenderTracker {
  private static instance: RenderTracker;
  private renderHistory: Map<string, RenderInfo[]> = new Map();
  private causeTreeMap: Map<string, CauseNode> = new Map();
  private maxHistorySize = 100;

  private constructor() {}

  static getInstance(): RenderTracker {
    if (!RenderTracker.instance) {
      RenderTracker.instance = new RenderTracker();
    }
    return RenderTracker.instance;
  }

  recordRender(info: RenderInfo): void {
    const history = this.renderHistory.get(info.componentName) || [];
    history.push(info);

    // Keep only recent history
    if (history.length > this.maxHistorySize) {
      history.shift();
    }

    this.renderHistory.set(info.componentName, history);

    if (info.causeTree) {
      this.causeTreeMap.set(
        `${info.componentName}-${info.renderCount}`,
        info.causeTree
      );
    }
  }

  getHistory(componentName: string): RenderInfo[] {
    return this.renderHistory.get(componentName) || [];
  }

  getCauseTree(componentName: string, renderCount: number): CauseNode | null {
    return this.causeTreeMap.get(`${componentName}-${renderCount}`) || null;
  }

  getAllComponents(): string[] {
    return Array.from(this.renderHistory.keys());
  }

  getStats(componentName: string): {
    totalRenders: number;
    unnecessaryRenders: number;
    averageChangedProps: number;
  } {
    const history = this.getHistory(componentName);
    const totalRenders = history.length;
    const unnecessaryRenders = history.filter(
      (info) => info.changedProps.length === 0
    ).length;
    const averageChangedProps =
      history.reduce((sum, info) => sum + info.changedProps.length, 0) /
        totalRenders || 0;

    return {
      totalRenders,
      unnecessaryRenders,
      averageChangedProps,
    };
  }

  clear(): void {
    this.renderHistory.clear();
    this.causeTreeMap.clear();
  }

  exportData(): string {
    const data = {
      renderHistory: Array.from(this.renderHistory.entries()),
      causeTreeMap: Array.from(this.causeTreeMap.entries()),
    };
    return JSON.stringify(data, null, 2);
  }
}

export default RenderTracker;

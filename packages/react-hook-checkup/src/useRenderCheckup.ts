import { useEffect, useRef } from "react";
import * as React from "react";
import {
  CheckupOptions,
  RenderInfo,
  PropChange,
  CauseNode,
  MemoizationSuggestion,
} from "./types";
import RenderTracker from "./RenderTracker";

const isDevelopment = process.env.NODE_ENV === "development";

function getComponentName(
  component: React.ComponentType<any> | string
): string {
  if (typeof component === "string") return component;
  return component.displayName || component.name || "Anonymous";
}

function arePropsEqual(prev: any, next: any): boolean {
  if (prev === next) return true;
  if (typeof prev !== "object" || typeof next !== "object") return false;
  if (prev === null || next === null) return false;

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) return false;

  return prevKeys.every((key) => prev[key] === next[key]);
}

function detectChangedProps(prevProps: any, nextProps: any): PropChange[] {
  if (!prevProps || !nextProps) return [];

  const changes: PropChange[] = [];
  const allKeys = new Set([
    ...Object.keys(prevProps),
    ...Object.keys(nextProps),
  ]);

  allKeys.forEach((key) => {
    const prevValue = prevProps[key];
    const nextValue = nextProps[key];

    if (prevValue !== nextValue) {
      const isUnstable =
        typeof nextValue === "function" ||
        (typeof nextValue === "object" && nextValue !== null);

      changes.push({
        propName: key,
        previousValue: prevValue,
        currentValue: nextValue,
        isUnstable,
      });
    }
  });

  return changes;
}

function buildCauseTree(
  componentName: string,
  changedProps: PropChange[],
  parentNode: CauseNode | null = null
): CauseNode | null {
  if (changedProps.length === 0) return null;

  const rootCause = changedProps.find((prop) => prop.isUnstable);

  if (!rootCause) {
    return {
      componentName,
      propName: changedProps[0].propName,
      reason: "Prop value changed",
      parent: parentNode,
      children: [],
    };
  }

  const causeNode: CauseNode = {
    componentName,
    propName: rootCause.propName,
    reason: `Unstable ${typeof rootCause.currentValue} passed as prop`,
    parent: parentNode,
    children: [],
  };

  return causeNode;
}

function generateSuggestions(
  changedProps: PropChange[]
): MemoizationSuggestion[] {
  const suggestions: MemoizationSuggestion[] = [];

  changedProps.forEach((prop) => {
    if (prop.isUnstable) {
      if (typeof prop.currentValue === "function") {
        suggestions.push({
          type: "useCallback",
          reason: `Function prop "${prop.propName}" creates new reference on each render`,
          propName: prop.propName,
          confidence: "high",
        });
      } else if (
        typeof prop.currentValue === "object" &&
        prop.currentValue !== null
      ) {
        if (Array.isArray(prop.currentValue)) {
          suggestions.push({
            type: "useMemo",
            reason: `Array prop "${prop.propName}" creates new reference on each render`,
            propName: prop.propName,
            confidence: "high",
          });
        } else {
          suggestions.push({
            type: "useMemo",
            reason: `Object prop "${prop.propName}" creates new reference on each render`,
            propName: prop.propName,
            confidence: "high",
          });
        }
      }
    }
  });

  // If many props changed, suggest React.memo
  if (changedProps.length === 0) {
    suggestions.push({
      type: "React.memo",
      reason: "Component re-rendered without prop changes",
      confidence: "high",
    });
  }

  return suggestions;
}

/**
 * Hook to track component re-renders and detect performance issues
 * @param componentName - Name of the component being tracked
 * @param props - Current props of the component
 * @param options - Configuration options
 */
export function useRenderCheckup(
  componentName: string,
  props: Record<string, any> = {},
  options: CheckupOptions = {}
): void {
  if (!isDevelopment && !options.enabled) {
    return;
  }

  const {
    logToConsole = true,
    trackCauseTree = true,
    onRender,
    includeValues = false,
  } = options;

  const renderCountRef = useRef(0);
  const prevPropsRef = useRef<Record<string, any>>(props);
  const tracker = RenderTracker.getInstance();

  useEffect(() => {
    renderCountRef.current += 1;
    const renderCount = renderCountRef.current;

    const changedProps = detectChangedProps(prevPropsRef.current, props);
    const causeTree = trackCauseTree
      ? buildCauseTree(componentName, changedProps)
      : null;

    const renderInfo: RenderInfo = {
      componentName,
      renderCount,
      timestamp: Date.now(),
      changedProps,
      causeTree,
    };

    tracker.recordRender(renderInfo);

    if (logToConsole) {
      const hasChanges = changedProps.length > 0;
      const color = hasChanges ? "#4CAF50" : "#FF9800";

      console.groupCollapsed(
        `%c🔄 ${componentName} rendered (#${renderCount})`,
        `color: ${color}; font-weight: bold;`
      );

      if (hasChanges) {
        console.log(
          "Changed props:",
          changedProps.map((p) => p.propName).join(", ")
        );

        if (includeValues) {
          changedProps.forEach((prop) => {
            console.log(`  ${prop.propName}:`, {
              previous: prop.previousValue,
              current: prop.currentValue,
              unstable: prop.isUnstable,
            });
          });
        }
      } else {
        console.warn("⚠️ Unnecessary render - no props changed");
      }

      const suggestions = generateSuggestions(changedProps);
      if (suggestions.length > 0) {
        console.group("💡 Suggestions:");
        suggestions.forEach((suggestion) => {
          console.log(`- ${suggestion.type}: ${suggestion.reason}`);
        });
        console.groupEnd();
      }

      if (causeTree) {
        console.log("Cause tree:", causeTree);
      }

      console.groupEnd();
    }

    if (onRender) {
      onRender(renderInfo);
    }

    prevPropsRef.current = props;
  });
}

/**
 * Get render statistics for a specific component
 */
export function getRenderStats(componentName: string) {
  const tracker = RenderTracker.getInstance();
  return tracker.getStats(componentName);
}

/**
 * Get all tracked components
 */
export function getTrackedComponents(): string[] {
  const tracker = RenderTracker.getInstance();
  return tracker.getAllComponents();
}

/**
 * Clear all tracking data
 */
export function clearCheckupData(): void {
  const tracker = RenderTracker.getInstance();
  tracker.clear();
}

/**
 * Export tracking data as JSON
 */
export function exportCheckupData(): string {
  const tracker = RenderTracker.getInstance();
  return tracker.exportData();
}

/**
 * Higher-order component to automatically track renders
 */
export function withRenderCheckup<P extends object>(
  Component: React.ComponentType<P>,
  options?: CheckupOptions
): React.ComponentType<P> {
  const componentName = getComponentName(Component);

  return function CheckupWrapper(props: P) {
    useRenderCheckup(componentName, props, options);
    return React.createElement(Component, props);
  };
}

export interface WorkspaceRecommendationConfig {
  priority?: Record<string, number>;
  milestone?: Record<string, number>;
  capability?: number;
  context?: number;
  dependencyLeverageMultiplier?: number;
}

export const DefaultRecommendationWeights = {
  priority: {
    P0: 100,
    P1: 75,
    P2: 50,
    P3: 25,
  } as Record<string, number>,
  milestone: {
    CURRENT: 80,
    NEXT: 40,
    FUTURE: 10,
  } as Record<string, number>,
  capability: 60,
  context: 40,
  dependencyLeverageMultiplier: 0.4,
};

export function getRecommendationWeights(config?: WorkspaceRecommendationConfig) {
  return {
    priority: { ...DefaultRecommendationWeights.priority, ...(config?.priority || {}) },
    milestone: { ...DefaultRecommendationWeights.milestone, ...(config?.milestone || {}) },
    capability: config?.capability ?? DefaultRecommendationWeights.capability,
    context: config?.context ?? DefaultRecommendationWeights.context,
    dependencyLeverageMultiplier:
      config?.dependencyLeverageMultiplier ?? DefaultRecommendationWeights.dependencyLeverageMultiplier,
  };
}

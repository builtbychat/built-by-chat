export type GrowthPhase = 'launch' | 'season-one' | 'intermission' | 'future';
export type CatalogExperimentStatus = 'ready' | 'blocked' | 'backlog';
export interface GrowthExperiment {
  id: string; title: string; lane: string; phase: GrowthPhase; status: CatalogExperimentStatus;
  hypothesis: string; action: string; primaryMetric: string; decisionRule: string; cost: 'low' | 'medium' | 'high';
  cadence: string; dependency: string; source: string;
}
export const growthCatalog: {
  version: number; northStar: string;
  funnel: Array<{id:string;label:string;question:string;metrics:string[]}>;
  experiments: GrowthExperiment[];
};

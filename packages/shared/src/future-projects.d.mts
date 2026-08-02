export type ProjectStatus = 'front-runner' | 'candidate' | 'wildcard' | 'hold';
export type ProjectScoreName = 'audienceAgency' | 'visualPayoff' | 'episodeEngine' | 'clipPotential' | 'safety' | 'hostSustainability';
export interface FutureProject {
  id: string; title: string; lane: string; status: ProjectStatus; horizon: string; format: string;
  premise: string; audienceControls: string[]; artifact: string; prototype: string; growthHook: string;
  risks: string[]; scores: Record<ProjectScoreName, number>;
}
export const futureProjectCatalog: {
  version: number; statusMeaning: Record<ProjectStatus, string>; weights: Record<ProjectScoreName, number>; projects: FutureProject[];
};
export function scoreFutureProject(project: FutureProject): number;

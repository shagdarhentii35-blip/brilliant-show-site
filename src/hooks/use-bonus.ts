import { useQuery } from "@tanstack/react-query";
import { bonusService } from "@/lib/bonus/bonusService";
import type { BonusId } from "@/lib/bonus/types";

export const bonusKeys = {
  catalog: ["bonus", "catalog"] as const,
  welcome: ["bonus", "welcome"] as const,
  daily: ["bonus", "daily"] as const,
  missions: ["bonus", "missions"] as const,
  scratch: ["bonus", "scratch"] as const,
  mystery: ["bonus", "mystery"] as const,
  race: ["bonus", "race"] as const,
  weekend: ["bonus", "weekend"] as const,
  detail: (id: BonusId) => ["bonus", "detail", id] as const,
};

export function useBonusCatalog() {
  return useQuery({ queryKey: bonusKeys.catalog, queryFn: () => bonusService.getCatalog() });
}

export function useWelcomeBonus() {
  return useQuery({ queryKey: bonusKeys.welcome, queryFn: () => bonusService.getWelcomeBonus() });
}

export function useDailyBonus() {
  return useQuery({ queryKey: bonusKeys.daily, queryFn: () => bonusService.getDailyBonus() });
}

export function useDailyMissions() {
  return useQuery({ queryKey: bonusKeys.missions, queryFn: () => bonusService.getDailyMissions() });
}

export function useScratchCards() {
  return useQuery({ queryKey: bonusKeys.scratch, queryFn: () => bonusService.getScratchCards() });
}

export function useMysteryBoxes() {
  return useQuery({ queryKey: bonusKeys.mystery, queryFn: () => bonusService.getMysteryBoxes() });
}

export function useDiamondRace() {
  return useQuery({ queryKey: bonusKeys.race, queryFn: () => bonusService.getDiamondRace() });
}

export function useWeekendBoost() {
  return useQuery({ queryKey: bonusKeys.weekend, queryFn: () => bonusService.getWeekendBoost() });
}

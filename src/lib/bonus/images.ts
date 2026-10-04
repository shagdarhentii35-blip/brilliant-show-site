import type { BonusId } from "./types";
import welcomeImage from "@/assets/welcome-gift.jpg";
import chestImage from "@/assets/daily-chest.jpg";
import missionImage from "@/assets/daily-mission.jpg";
import scratchImage from "@/assets/scratch-card.jpg";
import mysteryImage from "@/assets/mystery-box.jpg";
import raceImage from "@/assets/diamond-race.jpg";
import weekendImage from "@/assets/weekend-boost.jpg";

export const bonusImages: Record<BonusId, string> = {
  welcome: welcomeImage,
  daily: chestImage,
  mission: missionImage,
  scratch: scratchImage,
  mystery: mysteryImage,
  race: raceImage,
  weekend: weekendImage,
};

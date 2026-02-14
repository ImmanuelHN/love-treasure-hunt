import { QuizChoiceGame } from "../games/quiz-choice.js";
import { MemoryQuestionGame } from "../games/memory-question.js";
import { CombinationLockGame } from "../games/combination-lock.js";
import { YearSelectorGame } from "../games/timeline-slider.js";
import { FutureChoiceGame } from "../games/future-choice.js";
import { LoveLetterGame } from "../games/love-letter.js";
import { MultiMemoryQuizGame } from "../games/multi-memory-quiz.js";
import { ProgressiveLetterGame } from "../games/progressive-letter.js";
import { FinalCinematicGame } from "../games/final-cinematic.js";

export const GAME_REGISTRY = {
  map1: [QuizChoiceGame, MemoryQuestionGame],
  map2: [CombinationLockGame, YearSelectorGame],
  map3: [FutureChoiceGame, LoveLetterGame],
  map4: [MultiMemoryQuizGame],
  map5: [ProgressiveLetterGame, FinalCinematicGame]
};

export function getGameClass(mapNum, gameNum) {
  const mapKey = `map${mapNum}`;
  return GAME_REGISTRY[mapKey]?.[gameNum - 1] || null;
}

export function getMapCount() {
  return Object.keys(GAME_REGISTRY).length;
}

export function getGameCountForMap(mapNum) {
  return GAME_REGISTRY[`map${mapNum}`]?.length || 0;
}

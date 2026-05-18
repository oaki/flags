import { useCallback, useEffect, useState } from 'react';
import { levels, maxLevelId } from '../data/levels';

const STORAGE_KEY = 'flag-world-kids-progress-v1';

export type Progress = {
  currentLevel: number;
  unlockedLevel: number;
  bestScores: Record<number, number>;
  discoveredCountries: string[];
  countryAttempts: Record<string, number>;
  countryCorrect: Record<string, number>;
  countryMistakes: Record<string, number>;
  totalAnswered: number;
  totalCorrect: number;
  sessionsPlayed: number;
  dailyChallengeDates: string[];
};

const defaultProgress: Progress = {
  currentLevel: 1,
  unlockedLevel: 1,
  bestScores: {},
  discoveredCountries: [],
  countryAttempts: {},
  countryCorrect: {},
  countryMistakes: {},
  totalAnswered: 0,
  totalCorrect: 0,
  sessionsPlayed: 0,
  dailyChallengeDates: [],
};

const normalizeProgress = (progress: Progress): Progress => {
  const normalizedBestScores = levels.reduce<Record<number, number>>((scores, level) => {
    scores[level.id] = Math.min(progress.bestScores[level.id] || 0, level.questionCount);
    return scores;
  }, {});

  return {
    ...progress,
    currentLevel: Math.min(Math.max(progress.currentLevel, 1), maxLevelId),
    unlockedLevel: Math.min(Math.max(progress.unlockedLevel, 1), maxLevelId),
    bestScores: normalizedBestScores,
  };
};

const readProgress = (): Progress => {
  try {
    if (typeof window === 'undefined') return defaultProgress;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return normalizeProgress({ ...defaultProgress, ...JSON.parse(raw) });
  } catch {
    return defaultProgress;
  }
};

export type AnswerRecord = {
  countryCode: string;
  correct: boolean;
};

export const useProgress = () => {
  const [progress, setProgress] = useState<Progress>(readProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // iOS Safari can disable localStorage in private or restricted browser modes.
    }
  }, [progress]);

  const saveScore = useCallback((levelId: number, score: number, total: number, passed: boolean, discovered: string[], answers: AnswerRecord[], dailyDate?: string) => {
    setProgress((current) => {
      const cappedScore = Math.min(score, total);
      const countryAttempts = { ...current.countryAttempts };
      const countryCorrect = { ...current.countryCorrect };
      const countryMistakes = { ...current.countryMistakes };

      answers.forEach((answer) => {
        countryAttempts[answer.countryCode] = (countryAttempts[answer.countryCode] || 0) + 1;
        if (answer.correct) {
          countryCorrect[answer.countryCode] = (countryCorrect[answer.countryCode] || 0) + 1;
          return;
        }

        countryMistakes[answer.countryCode] = (countryMistakes[answer.countryCode] || 0) + 1;
      });

      return {
        currentLevel: passed ? Math.min(Math.max(current.currentLevel, levelId + 1), maxLevelId) : levelId,
        unlockedLevel: passed ? Math.min(Math.max(current.unlockedLevel, levelId + 1), maxLevelId) : current.unlockedLevel,
        bestScores: {
          ...current.bestScores,
          [levelId]: Math.min(Math.max(current.bestScores[levelId] || 0, cappedScore), total),
        },
        discoveredCountries: Array.from(new Set([...current.discoveredCountries, ...discovered])),
        countryAttempts,
        countryCorrect,
        countryMistakes,
        totalAnswered: current.totalAnswered + total,
        totalCorrect: current.totalCorrect + cappedScore,
        sessionsPlayed: current.sessionsPlayed + 1,
        dailyChallengeDates: dailyDate
          ? Array.from(new Set([...current.dailyChallengeDates, dailyDate]))
          : current.dailyChallengeDates,
      };
    });
  }, []);

  const chooseLevel = useCallback((levelId: number) => {
    setProgress((current) => ({ ...current, currentLevel: levelId }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  return { progress, saveScore, chooseLevel, resetProgress };
};

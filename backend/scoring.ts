const baseScores: Map<number, number> = new Map<number, number>([
    [0, 0],
    [1, 40],
    [2, 100],
    [3, 300],
    [4, 1200]
]);

export const computeScoreForClearedLines = (clearedLines: number, level: number): number => {
    return baseScores.get(clearedLines) * (level + 1);
}
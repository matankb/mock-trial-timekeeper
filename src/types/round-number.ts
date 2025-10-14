export type RoundNumber = 1 | 2 | 3 | 4;

export function isRoundNumber(round: number): round is RoundNumber {
  return round === 1 || round === 2 || round === 3 || round === 4;
}

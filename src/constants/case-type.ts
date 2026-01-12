export enum CaseType {
  Criminal = 'criminal',
  Civil = 'civil',
}

/**
 * TODO: document
 * @param startYear - if 2025, referring to the august 2025 - may 2026 season
 * @param caseTypeAtStartYear -
 * @returns
 */
export const createAlternatingCaseTypeResolver = (
  startYear: number,
  caseTypeAtStartYear: CaseType,
) => {
  const otherCaseType =
    caseTypeAtStartYear === CaseType.Criminal
      ? CaseType.Civil
      : CaseType.Criminal;

  return (trialDate: Date) => {
    const year = trialDate.getFullYear();
    const yearFromStart = year - startYear;
    const isEven = yearFromStart % 2 === 0;
    const isFirstHalfOfSeason = trialDate.getMonth() >= 5; // Season starts in August

    if ((isEven && isFirstHalfOfSeason) || (!isEven && !isFirstHalfOfSeason)) {
      return caseTypeAtStartYear;
    }
    return otherCaseType;
  };
};

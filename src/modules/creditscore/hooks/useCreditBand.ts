export const useCreditBand = (score: number) => {
  if (score >= 750) {
    return 'Excellent';
  }
  if (score >= 700) {
    return 'Good';
  }
  if (score >= 650) {
    return 'Fair';
  }
  return 'Needs Work';
};

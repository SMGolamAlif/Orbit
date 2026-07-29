const LIFE_EXPECTANCY_BY_COUNTRY: Record<string, number> = {
  'United States': 79,
  Canada: 82,
  'United Kingdom': 81,
  Australia: 83,
  Germany: 81,
  France: 82,
  Japan: 84,
  India: 70,
  China: 78,
  Brazil: 75,
  Nigeria: 55,
  'South Africa': 65,
  Singapore: 83,
  'United Arab Emirates': 78,
  Bangladesh: 73,
  Pakistan: 67,
  Indonesia: 72,
  Mexico: 75,
  Russia: 73,
  Italy: 83,
  Spain: 83,
  'South Korea': 83,
  Netherlands: 82,
  Sweden: 83,
  Switzerland: 84,
}

const DEFAULT_LIFE_EXPECTANCY = 80

function estimateLifeExpectancy(country: string | undefined): number {
  if (!country) return DEFAULT_LIFE_EXPECTANCY
  return LIFE_EXPECTANCY_BY_COUNTRY[country] ?? DEFAULT_LIFE_EXPECTANCY
}

export { DEFAULT_LIFE_EXPECTANCY, LIFE_EXPECTANCY_BY_COUNTRY, estimateLifeExpectancy }

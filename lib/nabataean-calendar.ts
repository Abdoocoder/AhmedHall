export const NABATAEAN_MONTHS = [
  "كانون ثاني",   // January
  "شباط",        // February
  "اذار",        // March
  "نيسان",       // April
  "ايار",        // May
  "حزيران",      // June
  "تموز",        // July
  "اب",          // August
  "ايلول",       // September
  "تشرين اول",   // October
  "تشرين ثاني",  // November
  "كانون اول",   // December
] as const

export const NABATAEAN_MONTHS_GENITIVE = [
  "كانون الثاني",   // January
  "شباط",          // February
  "اذار",          // March
  "نيسان",         // April
  "ايار",          // May
  "حزيران",        // June
  "تموز",          // July
  "اب",            // August
  "ايلول",         // September
  "تشرين الأول",   // October
  "تشرين الثاني",  // November
  "كانون الأول",   // December
] as const

export function getNabataeanMonth(date: Date): string {
  return NABATAEAN_MONTHS[date.getMonth()]
}

export function getNabataeanMonthGenitive(date: Date): string {
  return NABATAEAN_MONTHS_GENITIVE[date.getMonth()]
}

export function formatNabataeanDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = NABATAEAN_MONTHS_GENITIVE[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function formatNabataeanMonthYear(date: Date): string {
  const month = NABATAEAN_MONTHS_GENITIVE[date.getMonth()]
  const year = date.getFullYear()
  return `${month} ${year}`
}

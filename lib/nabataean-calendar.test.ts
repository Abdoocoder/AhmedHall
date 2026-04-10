import { describe, it, expect } from 'vitest'
import {
  getNabataeanMonth,
  getNabataeanMonthGenitive,
  formatNabataeanDate,
  formatNabataeanMonthYear,
  NABATAEAN_MONTHS,
  NABATAEAN_MONTHS_GENITIVE,
} from './nabataean-calendar'

describe('NABATAEAN_MONTHS', () => {
  it('should have 12 months', () => {
    expect(NABATAEAN_MONTHS).toHaveLength(12)
    expect(NABATAEAN_MONTHS_GENITIVE).toHaveLength(12)
  })

  it('should map months correctly', () => {
    expect(NABATAEAN_MONTHS[0]).toBe('كانون ثاني')   // January
    expect(NABATAEAN_MONTHS[2]).toBe('اذار')          // March
    expect(NABATAEAN_MONTHS[3]).toBe('نيسان')         // April
    expect(NABATAEAN_MONTHS[11]).toBe('كانون اول')    // December
  })
})

describe('getNabataeanMonth', () => {
  it('returns correct month for January', () => {
    expect(getNabataeanMonth(new Date(2026, 0, 1))).toBe('كانون ثاني')
  })

  it('returns correct month for April', () => {
    expect(getNabataeanMonth(new Date(2026, 3, 10))).toBe('نيسان')
  })

  it('returns correct month for December', () => {
    expect(getNabataeanMonth(new Date(2026, 11, 1))).toBe('كانون اول')
  })
})

describe('getNabataeanMonthGenitive', () => {
  it('returns genitive form for January', () => {
    expect(getNabataeanMonthGenitive(new Date(2026, 0, 1))).toBe('كانون الثاني')
  })

  it('returns genitive form for October', () => {
    expect(getNabataeanMonthGenitive(new Date(2026, 9, 1))).toBe('تشرين الأول')
  })
})

describe('formatNabataeanDate', () => {
  it('formats a date correctly', () => {
    expect(formatNabataeanDate('2026-04-10')).toContain('نيسان')
    expect(formatNabataeanDate('2026-04-10')).toContain('2026')
  })

  it('includes the day number', () => {
    const result = formatNabataeanDate('2026-04-10')
    expect(result).toMatch(/10/)
  })
})

describe('formatNabataeanMonthYear', () => {
  it('formats month and year correctly', () => {
    const result = formatNabataeanMonthYear(new Date(2026, 3, 1))
    expect(result).toBe('نيسان 2026')
  })

  it('formats March correctly', () => {
    const result = formatNabataeanMonthYear(new Date(2026, 2, 1))
    expect(result).toBe('اذار 2026')
  })
})

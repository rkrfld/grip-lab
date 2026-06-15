export const FONT_TO_V: Record<string, number> = {
  '3': 0, '4': 1, '5': 2, '5+': 3,
  '6A': 4, '6A+': 4, '6B': 5, '6B+': 5,
  '6C': 6, '6C+': 6, '7A': 7, '7A+': 8,
  '7B': 8, '7B+': 9, '7C': 10, '7C+': 11,
  '8A': 12, '8A+': 13, '8B': 14, '8B+': 15,
}

export const CUSTOM_TO_V: Record<string, number> = {
  '1': 0, '2': 1, '3': 2, '4': 3, '5': 4,
  '6': 5, '7': 6, '8': 7, '9': 8, '10': 9,
}

export const HUECO_GRADES = [
  'V0','V1','V2','V3','V4','V5','V6','V7','V8','V9','V10+',
]

export const FONT_GRADES = Object.keys(FONT_TO_V)
export const CUSTOM_GRADES = ['1','2','3','4','5','6','7','8','9','10']

export function toVGrade(raw: string, system: string): number {
  if (system === 'hueco') return parseInt(raw.replace('V', '')) || 0
  if (system === 'font')  return FONT_TO_V[raw]    ?? 0
  if (system === 'custom') return CUSTOM_TO_V[raw] ?? 0
  return 0
}

export function toVLabel(vGrade: number): string {
  return vGrade >= 10 ? 'V10+' : `V${vGrade}`
}

export function getGradeList(system: string): string[] {
  if (system === 'font')   return FONT_GRADES
  if (system === 'custom') return CUSTOM_GRADES
  return HUECO_GRADES
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

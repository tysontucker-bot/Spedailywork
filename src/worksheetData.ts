export interface PictogramSelection {
  query: string
  pictogramId: number | null
  pictogramLabel: string
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u'])
const CVC_WORDS = [
  'bad', 'bag', 'bat', 'bed', 'beg', 'bet', 'bib', 'big', 'bin', 'bit',
  'bob', 'bog', 'box', 'bug', 'bun', 'bus', 'cab', 'cap', 'cat', 'cop',
  'cot', 'cub', 'cup', 'dad', 'den', 'dig', 'dip', 'dog', 'dot', 'fan',
  'fig', 'fin', 'fix', 'fog', 'fox', 'gap', 'gas', 'gum', 'hat', 'hen',
  'hid', 'hip', 'hog', 'hop', 'hot', 'hug', 'hut', 'jet', 'jog', 'kid',
  'leg', 'lid', 'lip', 'log', 'man', 'map', 'mat', 'mix', 'mop', 'mud',
  'mug', 'nap', 'net', 'pan', 'pen', 'pet', 'pig', 'pin', 'pit', 'pop',
  'pot', 'rag', 'ram', 'red', 'rib', 'rid', 'rig', 'rip', 'rod', 'rug',
  'run', 'sad', 'sat', 'sip', 'six', 'sun', 'tag', 'tap', 'ten', 'tip',
  'top', 'tub', 'van', 'vet', 'web', 'wet', 'wig', 'win', 'yak', 'yum',
  'zip',
] as const

const CVC_WORD_SET = new Set<string>(CVC_WORDS)

export interface CalendarData {
  monthDay: string
  monthYear: string
  selectedDay: number | null
  weekdayLabels: string[]
  weeks: Array<Array<number | null>>
}

export function createPictureSelection(query: string): PictogramSelection {
  return {
    query,
    pictogramId: null,
    pictogramLabel: '',
  }
}

export function normalizeWord(value: string): string {
  return value.trim().toLowerCase()
}

function parseIsoDate(isoDate: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return null
  }

  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (
    Number.isNaN(date.getTime())
    || date.getFullYear() !== year
    || date.getMonth() !== month - 1
    || date.getDate() !== day
  ) {
    return null
  }

  return date
}

export function formatMonthDay(isoDate: string): string {
  const date = parseIsoDate(isoDate)
  if (!date) return ''
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

export function buildCalendar(isoDate: string): CalendarData {
  const date = parseIsoDate(isoDate)

  if (!date) {
    return {
      monthDay: '',
      monthYear: '',
      selectedDay: null,
      weekdayLabels: WEEKDAY_LABELS,
      weeks: Array.from({ length: 5 }, () => Array<number | null>(7).fill(null)),
    }
  }

  const year = date.getFullYear()
  const monthIndex = date.getMonth()
  const selectedDay = date.getDate()
  const firstWeekday = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  const cells = Array<number | null>(totalCells).fill(null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells[firstWeekday + day - 1] = day
  }

  const weeks: Array<Array<number | null>> = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  return {
    monthDay: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    monthYear: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    selectedDay,
    weekdayLabels: WEEKDAY_LABELS,
    weeks,
  }
}

export function getCvcValidationError(value: string): string | null {
  const normalized = normalizeWord(value)

  if (!normalized) {
    return null
  }

  if (!/^[a-z]{3}$/.test(normalized)) {
    return 'Enter a three-letter word using letters only.'
  }

  const [first, middle, last] = normalized
  if (VOWELS.has(first) || !VOWELS.has(middle) || VOWELS.has(last)) {
    return 'Enter a consonant-vowel-consonant word.'
  }

  if (!CVC_WORD_SET.has(normalized)) {
    return 'Enter a supported common CVC word such as cat, bed, or sun.'
  }

  return null
}

function differenceCount(left: string, right: string): number {
  let count = 0

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      count += 1
    }
  }

  return count
}

function hashSeed(value: string): number {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

function seededRandom(seed: number): () => number {
  let current = seed || 1

  return () => {
    current = (current * 1664525 + 1013904223) >>> 0
    return current / 2 ** 32
  }
}

export function buildCvcChoices(value: string, seedKey: string): string[] {
  const target = normalizeWord(value)
  if (getCvcValidationError(target)) {
    return []
  }

  const scoredCandidates = CVC_WORDS
    .filter(candidate => candidate !== target)
    .map(candidate => {
      const diffCount = differenceCount(candidate, target)
      const sameVowel = candidate[1] === target[1]
      const matchingEdges = Number(candidate[0] === target[0]) + Number(candidate[2] === target[2])
      const score = (sameVowel ? 6 : 0) + (diffCount === 1 ? 4 : diffCount === 2 ? 2 : 0) + matchingEdges * 2

      return {
        candidate,
        score,
        tieBreaker: hashSeed(`${seedKey}:${candidate}`),
      }
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      if (left.tieBreaker !== right.tieBreaker) {
        return left.tieBreaker - right.tieBreaker
      }

      return left.candidate.localeCompare(right.candidate)
    })

  const distractors = scoredCandidates.slice(0, 2).map(item => item.candidate)
  const choices = [target, ...distractors]
  const random = seededRandom(hashSeed(seedKey))

  for (let index = choices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[choices[index], choices[swapIndex]] = [choices[swapIndex], choices[index]]
  }

  return choices
}

export function getArasaacImageUrl(id: number): string {
  return `https://static.arasaac.org/pictograms/${id}/${id}_nocolor_500.png`
}

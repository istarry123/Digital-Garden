// Replicates dsh-jev's jev_rank primitive (src/ask-tools.ts:167-246) verbatim:
// same endpoint, same model, same score criteria, same prompt wording, same sort rule.
// Runs ONE ranking per criterion so per-criterion scores are preserved.
// The API key is read from ~/.dsh/.env inside this process, never as an argument.
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const envText = readFileSync(join(homedir(), '.dsh', '.env'), 'utf8')
const apiKey = envText.match(/TYPESAFE_API_KEY=([^\r\n]+)/)?.[1]?.trim()
if (!apiKey) throw new Error('TYPESAFE_API_KEY not found in ~/.dsh/.env')

const state = readFileSync(process.argv[2], 'utf8')

// Verbatim from ask-tools.ts:215 — the score levels used by jev_rank.
const SCORE_CRITERIA = ['Does not satisfy', 'Partially satisfies', 'Fully satisfies']

const candidates = [
  {
    id: 'A',
    label: 'equipment_no UNIQUE',
    description:
      'Declare a UNIQUE constraint on equipment_no, so one equipment number can correspond to at most one device row. Multiple physical machines sharing a number would be rejected at the database level.',
  },
  {
    id: 'B',
    label: 'equipment_no allowed to repeat; equipment.id is the physical-device unique identity',
    description:
      'equipment_no carries no uniqueness constraint at all and is treated purely as a human-facing label (repeatable, nullable, may contain Chinese). equipment.id is the sole unique identity used by all references, borrow records and transfer history.',
  },
  {
    id: 'C',
    label: 'equipment_no + sequence UNIQUE (composite unique key)',
    description:
      'A composite UNIQUE constraint over the pair (equipment_no, sequence), where sequence is the within-group display ordinal currently named equipment_seq. Uniqueness is thus enforced per (number, ordinal) pair rather than per device identity.',
  },
]

const criteria = [
  {
    id: 'c1',
    text: 'How well does this design support MULTIPLE PHYSICAL DEVICES that share the SAME equipment number?',
  },
  {
    id: 'c2',
    text: 'How well does this design PRESERVE EXISTING HISTORICAL DATA (2148 existing devices, 2481 transfer records that must never be deleted, and 2 real machines that already share numbers)?',
  },
  {
    id: 'c3',
    text: 'How well is this design SUITED TO DEVICE BORROW MANAGEMENT (one device = one borrow record, borrow/return/transfer by the actual physical machine, with a 8-action state machine)?',
  },
]

async function rankOne(criterion) {
  const questions = {}
  for (const c of candidates) {
    // Verbatim prompt shape from ask-tools.ts:213-216.
    questions['rank_' + c.id] = {
      type: 'score',
      instructions:
        'How well does "' + c.label + '" (' + (c.description ?? 'no description') +
        ') satisfy: ' + criterion.text + '?',
      criteria: SCORE_CRITERIA,
    }
  }

  const body = JSON.stringify({
    model: 'jev-latest',
    state: JSON.stringify({ context: state, criterion: criterion.text }),
    questions,
  })

  const started = Date.now()
  const res = await fetch('https://api.typesafe.ai/v1/systemone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body,
  })
  const latencyMs = Date.now() - started
  if (!res.ok) return { criterion, error: `HTTP ${res.status}`, body: (await res.text()).slice(0, 400) }

  const data = await res.json()
  const ranked = candidates
    .map((c) => {
      const r = data?.answers?.['rank_' + c.id]
      return {
        id: c.id,
        label: c.label,
        score: r?.type === 'score' ? r.score : undefined,
        confidence: r?.type === 'score' ? r.confidence : undefined,
        unknown: !(r?.type === 'score') || r?.unknown === true,
      }
    })
    // Verbatim sort from ask-tools.ts:237.
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))

  return { criterionId: criterion.id, criterion: criterion.text, engine: data?.model, latencyMs, ranked }
}

const out = []
for (const criterion of criteria) {
  out.push(await rankOne(criterion))
}
console.log(JSON.stringify(out, null, 2))

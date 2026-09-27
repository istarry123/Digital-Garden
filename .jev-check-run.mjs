// Replicates dsh-jev's jev_check primitive (src/ask-tools.ts:250-311) verbatim:
// same endpoint, same model, same prompt wording, same threshold rule.
// The API key is read from ~/.dsh/.env inside this process, never as an argument.
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const envText = readFileSync(join(homedir(), '.dsh', '.env'), 'utf8')
const apiKey = envText.match(/TYPESAFE_API_KEY=([^\r\n]+)/)?.[1]?.trim()
if (!apiKey) throw new Error('TYPESAFE_API_KEY not found in ~/.dsh/.env')

const state = readFileSync(process.argv[2], 'utf8')
const claim = process.argv[3]
const threshold = 0.7

const body = JSON.stringify({
  model: 'jev-latest',
  state,
  questions: {
    holds: {
      type: 'noul',
      instructions: 'Given the state, is the following claim supported and true: ' + claim,
    },
  },
})

const started = Date.now()
const res = await fetch('https://api.typesafe.ai/v1/systemone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
  body,
})
const latencyMs = Date.now() - started

if (!res.ok) {
  console.log(JSON.stringify({ error: `HTTP ${res.status}`, body: (await res.text()).slice(0, 500) }, null, 2))
  process.exit(1)
}

const data = await res.json()
const answer = data?.answers?.holds
const probability = answer?.noul ?? answer?.probability
const unknown = probability === undefined
const holds = !unknown && probability >= threshold

console.log(JSON.stringify({
  engine: data?.model,
  holds,
  probability: probability ?? 0,
  unknown,
  latencyMs,
  threshold,
  usage: data?.usage,
  text: 'claim ' + (unknown ? 'undecided' : holds ? 'holds' : 'does not hold') +
        ' (p=' + (probability ?? 'n/a') + ', threshold=' + threshold + ')',
}, null, 2))

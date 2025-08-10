import { useEffect, useMemo, useState } from 'react'

type Question = {
  id: string
  type: 'MCQ_SINGLE' | 'FILL_IN'
  stem: string
  choices?: { id: string; text: string }[]
  correct: string | string[]
  explanation?: string
}

const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'MCQ_SINGLE',
    stem: 'Choose the correct answer: He ____ to school every day.',
    choices: [
      { id: 'A', text: 'go' },
      { id: 'B', text: 'goes' },
      { id: 'C', text: 'going' },
      { id: 'D', text: 'gone' },
    ],
    correct: 'B',
    explanation: 'Present simple with he/she/it uses "goes".',
  },
  {
    id: 'q2',
    type: 'FILL_IN',
    stem: 'Fill in: She ___ very well.',
    correct: 'sings',
    explanation: 'Verb "sing" in present simple: sings.'
  },
]

function shuffle<T>(arr: T[], seed = 1): T[] {
  // simple deterministic shuffle by seed
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const r = s / 233280
    const j = Math.floor(r * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Practice() {
  const userId = 'demoUser' // TODO: read from auth
  const seed = useMemo(() => Math.abs(hashCode(userId)) % 10000, [userId])
  const questions = useMemo(() => {
    return shuffle(DEMO_QUESTIONS, seed)
  }, [seed])

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const raw = localStorage.getItem('answers')
    return raw ? JSON.parse(raw) : {}
  })
  const [results, setResults] = useState<Record<string, boolean>>(() => {
    const raw = localStorage.getItem('results')
    return raw ? JSON.parse(raw) : {}
  })

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers))
  }, [answers])
  useEffect(() => {
    localStorage.setItem('results', JSON.stringify(results))
  }, [results])

  const q = questions[index]

  function checkAnswer(): void {
    const a = answers[q.id]
    let correct = false
    if (q.type === 'MCQ_SINGLE') correct = a === q.correct
    else correct = (a || '').trim().toLowerCase() === String(q.correct).trim().toLowerCase()
    setResults({ ...results, [q.id]: correct })
  }

  function next(): void {
    setIndex((i) => Math.min(i + 1, questions.length - 1))
  }
  function prev(): void {
    setIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h2>Practice (demo)</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {questions.map((qq, i) => (
          <button key={qq.id} onClick={() => setIndex(i)} style={{ padding: '4px 8px', background: i === index ? '#eef' : '#f4f4f4' }}>
            {i + 1}
          </button>
        ))}
      </div>

      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
        <p><strong>Câu {index + 1}.</strong> {q.stem}</p>
        {q.type === 'MCQ_SINGLE' ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {q.choices!.map((c) => (
              <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === c.id}
                  onChange={() => setAnswers({ ...answers, [q.id]: c.id })}
                />
                <span>{c.id}. {c.text}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            placeholder="Nhập đáp án"
            value={answers[q.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
          />
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={prev}>Prev</button>
          <button onClick={checkAnswer}>Kiểm tra</button>
          <button onClick={next}>Next</button>
        </div>

        {q.id in results && (
          <div style={{ marginTop: 12 }}>
            <p style={{ color: results[q.id] ? 'green' : 'crimson' }}>
              {results[q.id] ? 'Đúng' : 'Sai'}
            </p>
            <p>{q.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return h
}
export default function Review() {
  const answers = JSON.parse(localStorage.getItem('answers') || '{}') as Record<string, string>
  const results = JSON.parse(localStorage.getItem('results') || '{}') as Record<string, boolean>

  const entries = Object.entries(results)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h2>Kết quả (demo)</h2>
      {entries.length === 0 ? (
        <p>Chưa có dữ liệu. Hãy làm bài ở mục Practice.</p>
      ) : (
        <ul>
          {entries.map(([qid, ok]) => (
            <li key={qid}>
              {qid}: {ok ? 'Đúng' : 'Sai'} — trả lời: {String(answers[qid])}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
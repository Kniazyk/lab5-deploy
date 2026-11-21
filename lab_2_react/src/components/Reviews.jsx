import { useEffect, useState } from 'react'

// Номер варіанта (порядковий номер у журналі групи)
const VARIANT = 10

function Reviews() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadComments() {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${VARIANT}/comments`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setComments(data) // порядок отримання зберігається
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error:', err)
          setError('Не вдалося завантажити відгуки. Спробуйте пізніше.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadComments()

    return () => controller.abort() // скасувати запит при демонтуванні
  }, [])

  return (
    <section className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-md transition duration-200 hover:border-teal-600 hover:shadow-lg md:col-span-2 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-500">
      <h2 className="mb-3 border-b-2 border-teal-100 pb-2 text-2xl font-semibold text-teal-700 dark:border-teal-900 dark:text-teal-300">
        Відгуки колишніх роботодавців
      </h2>

      {loading && <p role="status">Завантаження відгуків...</p>}

      {error && (
        <p role="alert" className="font-semibold text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700"
            >
              <h3 className="text-base font-semibold capitalize text-slate-900 dark:text-slate-100">
                {comment.name}
              </h3>
              <p className="mb-2 text-sm text-teal-700 dark:text-teal-300">{comment.email}</p>
              <p className="text-sm leading-relaxed">{comment.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Reviews

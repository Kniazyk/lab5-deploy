import { useEffect, useState } from 'react'

// TODO: замініть [FORMspree_ENDPOINT] на ваш endpoint із Formspree
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/[FORMspree_ENDPOINT]'
const SHOW_DELAY_MS = 60000 // 1 хвилина
const CLOSED_KEY = 'contactFormClosed'

const inputClass =
  'mt-1 w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-teal-600 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'

function ContactForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  // Показати модальне вікно через 1 хвилину (якщо його не закривали в цій сесії)
  useEffect(() => {
    if (sessionStorage.getItem(CLOSED_KEY)) return

    const timerId = setTimeout(() => setIsOpen(true), SHOW_DELAY_MS)
    return () => clearTimeout(timerId) // очищення таймера при демонтуванні
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem(CLOSED_KEY, '1')
  }

  // Закриття клавішею Escape
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault() // залишаємося на сторінці; без JS спрацює звичайний POST
    const form = e.currentTarget

    if (FORMSPREE_ENDPOINT.includes('[')) {
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus('success')
      form.reset()
    } catch (err) {
      console.error('Error:', err)
      setStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="max-h-full w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800"
      >
        <h2 id="contact-title" className="mb-4 text-2xl font-semibold text-teal-700 dark:text-teal-300">
          Зворотний зв'язок
        </h2>

        <form action={FORMSPREE_ENDPOINT} method="POST" onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            Ім'я
            <input type="text" name="name" required autoFocus className={inputClass} />
          </label>
          <label className="block">
            Email
            <input type="email" name="email" required className={inputClass} />
          </label>
          <label className="block">
            Номер телефону
            <input type="tel" name="phone" required className={inputClass} />
          </label>
          <label className="block">
            Повідомлення
            <textarea name="message" rows="4" required className={inputClass} />
          </label>

          <p role="status" className="min-h-6 text-sm">
            {status === 'sending' && 'Надсилання...'}
            {status === 'success' && (
              <span className="font-semibold text-green-700 dark:text-green-400">
                Дякуємо! Повідомлення надіслано.
              </span>
            )}
            {status === 'error' && (
              <span className="font-semibold text-red-600 dark:text-red-400">
                Не вдалося надіслати. Перевірте endpoint Formspree і спробуйте ще раз.
              </span>
            )}
          </p>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white transition hover:bg-teal-600 disabled:opacity-60"
            >
              Надіслати
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border-2 border-slate-300 px-4 py-2 font-semibold transition hover:border-teal-600 dark:border-slate-600"
            >
              Закрити
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm

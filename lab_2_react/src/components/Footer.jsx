import { useEffect, useState } from 'react'

const STORAGE_KEY = 'systemInfo'

// Збирає доступну інформацію про браузер та операційну систему
function collectSystemInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.userAgentData?.platform ?? navigator.platform,
    vendor: navigator.vendor,
    language: navigator.language,
    languages: (navigator.languages ?? []).join(', '),
    cookieEnabled: String(navigator.cookieEnabled),
    online: String(navigator.onLine),
    cpuCores: String(navigator.hardwareConcurrency ?? 'н/д'),
    screen: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

// Зчитує ВСЕ, що є в localStorage (JSON-об'єкти розгортає у пари ключ/значення)
function readLocalStorage() {
  const result = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    const raw = localStorage.getItem(key)
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([k, v]) => {
          result[k] = String(v)
        })
        continue
      }
    } catch {
      // значення не є JSON - показуємо як є
    }
    result[key] = raw
  }
  return result
}

const linkClass =
  'font-semibold text-teal-200 underline underline-offset-4 transition hover:text-amber-400 focus:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400'

function Footer() {
  const [info, setInfo] = useState({})

  useEffect(() => {
    try {
      // 1. Зберегти у localStorage (лише рядки -> JSON.stringify)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collectSystemInfo()))
      // 2. Отримати з localStorage та передати у стан для відображення
      // eslint-disable-next-line react-hooks/set-state-in-effect -- дані з localStorage доступні лише в браузері, після монтування
      setInfo(readLocalStorage())
    } catch (error) {
      console.error('localStorage недоступний:', error)
    }
  }, [])

  const entries = Object.entries(info)

  return (
    <footer className="border-t-4 border-amber-500 bg-teal-900 px-6 py-6 text-center text-white dark:bg-teal-950">
      <h2 className="mb-3 text-2xl font-semibold">Контакти</h2>
      <p className="mb-2">
        Email:{' '}
        <a href="mailto:anastasiia.kniazyk.kb.2025@lpnu.ua" className={linkClass}>
          anastasiia.kniazyk.kb.2025@lpnu.ua
        </a>
      </p>
      <p>
        GitHub:{' '}
        <a href="https://github.com/Kniazyk" className={linkClass}>
          github.com/Kniazyk
        </a>
      </p>

      {entries.length > 0 && (
        <div className="mx-auto mt-6 max-w-3xl border-t border-teal-700 pt-4 text-left">
          <h3 className="mb-2 text-center text-lg font-semibold">Системна інформація</h3>
          <dl className="grid gap-x-4 gap-y-1 text-xs sm:grid-cols-[max-content_1fr]">
            {entries.map(([key, value]) => (
              <div key={key} className="contents">
                <dt className="font-semibold text-teal-200">{key}</dt>
                <dd className="break-words text-teal-50">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </footer>
  )
}

export default Footer

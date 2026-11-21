function Experience() {
  return (
    <section className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-md transition duration-200 hover:border-teal-600 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-500">
      <h2 className="mb-3 border-b-2 border-teal-100 pb-2 text-2xl font-semibold text-teal-700 dark:border-teal-900 dark:text-teal-300">
        Досвід роботи
      </h2>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Студентка-практикант</h3>
      <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Червень 2026 — Серпень 2026</p>
      <ul className="list-disc space-y-1 pl-5 marker:text-teal-600">
        <li>Написання скриптів на Python</li>
        <li>Аналіз захисту вебтрафіку</li>
      </ul>
    </section>
  )
}

export default Experience
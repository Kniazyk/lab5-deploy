function Skills() {
  return (
    <section className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-md transition duration-200 hover:border-teal-600 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-500">
      <h2 className="mb-3 border-b-2 border-teal-100 pb-2 text-2xl font-semibold text-teal-700 dark:border-teal-900 dark:text-teal-300">
        Навички
      </h2>
      <ul className="list-disc space-y-1 pl-5 marker:text-teal-600">
        <li>HTML</li>
        <li>Робота з Cisco Packet Tracer</li>
        <li>Основи Python та Git/GitHub</li>
      </ul>
    </section>
  )
}

export default Skills
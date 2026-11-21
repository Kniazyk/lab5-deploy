function Header({ name, role, theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header className="relative border-b-4 border-teal-900 bg-teal-700 px-6 py-10 text-center text-white shadow-md dark:border-teal-950 dark:bg-teal-900">
      <button
        type="button"
        onClick={onToggleTheme}
        aria-pressed={isDark}
        className="absolute top-3 right-3 rounded-lg border-2 border-white/60 px-3 py-1 text-sm font-semibold transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      >
        {isDark ? '☀️ Світла тема' : '🌙 Темна тема'}
      </button>

      <h1 className="mb-2 mt-4 text-3xl font-bold tracking-wide sm:mt-0 sm:text-5xl">{name}</h1>
      <p className="text-lg uppercase tracking-widest opacity-90 sm:text-xl">{role}</p>
    </header>
  )
}

export default Header

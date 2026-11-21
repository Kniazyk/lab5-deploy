import { useState } from 'react'
import Header from './components/Header'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Reviews from './components/Reviews'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'

// Світла тема: з 07:00 включно до 21:00 (не включно), в інший час - темна
function getThemeByTime(date = new Date()) {
  const hour = date.getHours()
  return hour >= 7 && hour < 21 ? 'light' : 'dark'
}

function App() {
  // Початкова тема визначається за місцевим часом користувача при першому рендері
  const [theme, setTheme] = useState(getThemeByTime)

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <div
      className={`${theme === 'dark' ? 'dark' : ''} flex min-h-screen flex-col bg-slate-100 font-sans text-slate-800 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-200`}
    >
      <Header
        name="Князик Анастасія"
        role="Cybersecurity Intern"
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* На телефоні одна колонка, від md (768px) - дві колонки */}
      <main className="mx-auto my-8 grid w-full max-w-5xl flex-1 gap-6 px-4 md:grid-cols-2">
        <section className="rounded-xl border-2 border-slate-200 border-l-8 border-l-teal-700 bg-white p-6 shadow-md transition duration-200 hover:border-teal-600 hover:shadow-lg dark:border-slate-700 dark:border-l-teal-500 dark:bg-slate-800 dark:hover:border-teal-500">
          <h2 className="mb-3 border-b-2 border-teal-100 pb-2 text-2xl font-semibold text-teal-700 dark:border-teal-900 dark:text-teal-300">
            Про мене
          </h2>
          <p className="leading-relaxed">
            Студентка, яка вивчає кібербезпеку, інформаційну безпеку,
            кібергігієну та сучасні методи захисту даних.
          </p>
        </section>

        <Experience />
        <Education />
        <Skills />
        <Reviews />
      </main>

      <Footer />
      <ContactForm />
    </div>
  )
}

export default App

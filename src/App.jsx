import { useState } from 'react'
import './App.css'

// PLACEHOLDER CONTENT — the repository had no component in it when this project
// was scaffolded. Replace `itinerary` and this component with the real one;
// nothing else in the project depends on what lives in this file.
const itinerary = [
  {
    day: 'Day 1',
    date: 'Saturday',
    title: 'Arrival & Île de la Cité',
    stops: [
      { time: '14:00', name: 'Hotel check-in', note: 'Drop bags, resist the nap' },
      { time: '16:00', name: 'Sainte-Chapelle', note: 'Go late — the windows catch the low sun' },
      { time: '18:30', name: 'Walk the Seine to Pont Neuf' },
      { time: '20:00', name: 'Dinner in the Latin Quarter' },
    ],
  },
  {
    day: 'Day 2',
    date: 'Sunday',
    title: 'Louvre & Tuileries',
    stops: [
      { time: '09:00', name: 'Louvre', note: 'Book the first entry slot, start in the Denon wing' },
      { time: '13:00', name: 'Lunch at Café Marly' },
      { time: '15:00', name: 'Jardin des Tuileries' },
      { time: '17:30', name: "Musée de l'Orangerie", note: 'The Water Lilies rooms are worth the detour' },
    ],
  },
  {
    day: 'Day 3',
    date: 'Monday',
    title: 'Montmartre',
    stops: [
      { time: '10:00', name: 'Sacré-Cœur' },
      { time: '11:30', name: 'Place du Tertre & rue Lepic' },
      { time: '14:00', name: 'Musée de Montmartre' },
      { time: '19:00', name: 'Sunset from the steps' },
    ],
  },
  {
    day: 'Day 4',
    date: 'Tuesday',
    title: 'Tower & Left Bank',
    stops: [
      { time: '09:30', name: 'Eiffel Tower', note: 'Stairs to the second floor beat the lift queue' },
      { time: '12:30', name: 'Rue Cler for lunch' },
      { time: '15:00', name: 'Musée Rodin', note: 'The garden is the point' },
      { time: '18:00', name: 'Saint-Germain-des-Prés' },
    ],
  },
]

function App() {
  const [openDay, setOpenDay] = useState(0)

  return (
    <main className="app">
      <header className="header">
        <p className="eyebrow">Itinerary</p>
        <h1>Paris</h1>
        <p className="subtitle">Four days, one notebook.</p>
      </header>

      <ol className="days">
        {itinerary.map((entry, index) => {
          const isOpen = openDay === index
          return (
            <li key={entry.day} className={isOpen ? 'day open' : 'day'}>
              <button
                type="button"
                className="day-header"
                aria-expanded={isOpen}
                onClick={() => setOpenDay(isOpen ? -1 : index)}
              >
                <span className="day-label">
                  <span className="day-number">{entry.day}</span>
                  <span className="day-date">{entry.date}</span>
                </span>
                <span className="day-title">{entry.title}</span>
                <span className="chevron" aria-hidden="true" />
              </button>

              {isOpen && (
                <ul className="stops">
                  {entry.stops.map((stop) => (
                    <li key={stop.time + stop.name} className="stop">
                      <span className="stop-time">{stop.time}</span>
                      <span className="stop-body">
                        <span className="stop-name">{stop.name}</span>
                        {stop.note && <span className="stop-note">{stop.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}

export default App

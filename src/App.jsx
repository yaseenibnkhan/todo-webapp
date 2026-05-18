import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'todoTasks'

function App() {
  const [task, setTask] = useState('')
  
  // 1. Lazy Initialization: Page load hote hi sab se pehle local storage se data uthaye ga
  const [tasks, setTasks] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      } catch (error) {
        console.warn('Failed to parse saved tasks:', error)
      }
    }
    return [] // Agar pehle se koi data na ho to khali array se start kare
  })

  const taskCount = tasks.length
  const taskLabel = taskCount === 1 ? 'task' : 'tasks'

  // 2. Sirf ek useEffect jo jab bhi tasks me koi tabdeeli ho, use save kare
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = task.trim()
    if (!text) return
    setTasks((currentTasks) => [...currentTasks, { id: Date.now(), text }])
    setTask('')
  }

  const removeTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  const clearAll = () => {
    setTasks([])
  }

  return (
    <div className="app-shell">
      <header className="todo-header">
        <div>
          <h1>Todo WebApp</h1>
          <p className="todo-subtitle">Build your list, save it automatically, and keep your day on track.</p>
        </div>
        <button type="button" className="clear-button" onClick={clearAll} disabled={taskCount === 0}>
          Clear All
        </button>
      </header>

      <div className="todo-meta">
        <span>{taskCount} {taskLabel} saved locally</span>
        <span>{taskCount === 0 ? 'Start by adding a new task.' : 'Remove only what you choose.'}</span>
      </div>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          className="todo-input"
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(event) => setTask(event.target.value)}
          aria-label="Add new todo"
        />
        <button className="add-button" type="submit">
          Add Task
        </button>
      </form>

      <section className="todo-box">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one above to start your list.</p>
        ) : (
          <ul className="todo-list">
            {tasks.map((item) => (
              <li key={item.id} className="todo-item">
                <span>{item.text}</span>
                <button type="button" className="remove-button" onClick={() => removeTask(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App
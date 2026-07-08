import reactLogo from './assets/react.svg'
import './App.css'
import Header from './components/Header'
import Button from './components/Button'

function App() {
  const handleClick = () => {
    alert('Button clicked!');
  }

  return (
    <>
      <Header logo={reactLogo} />
      <main>
        <h2>Welcome to Stellar App!</h2>
        <p>This is the starting point for your new application.</p>
        <div className="button-container">
          <Button onClick={handleClick} icon="github-icon">Primary</Button>
          <Button onClick={handleClick} className="secondary">Secondary</Button>
        </div>
      </main>
    </>
  )
}

export default App

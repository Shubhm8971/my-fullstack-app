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
        <Button onClick={handleClick}>Click me!</Button>
      </main>
    </>
  )
}

export default App

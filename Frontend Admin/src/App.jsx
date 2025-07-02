import { useState } from 'react';
import Display from './Components/Display/Display';
import Button from './Components/Button/Button';
import Link from './Components/Link/Link';
import Logo from './Components/Logos/Logo';


import './App.css';

function App() {
  const [isSent, setIsSent] = useState(false);

  const handleDataSent = () =>{
    setIsSent(true);
  }

  return (
    <>
    <div className="App">
      <Logo />
      <Display isSent={isSent} setIsSent={setIsSent} />
      <Button onDataSent={handleDataSent}/>
      <Link/>
    </div>
    </>
  );
}

export default App;
import React, { useState } from 'react';
import { Signature } from './components/Signature/Signature';
import './App.css';

function App() {
  const [isShowSign, setIsSHowSign] = useState(false);
  const onChangeVisibility = () => {
    setIsSHowSign(!isShowSign);
  }
  return (
    <div>
      {isShowSign ? (<Signature />) : null}
      <button onClick={onChangeVisibility}>
        Show/hide Signature
      </button>
    </div>
  );
}

export default App;

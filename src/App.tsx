import React from 'react';
import './styles/app.scss';
import Field from "./components/Field/Field";
import Canvas from "./components/Canvas/Canvas";

function App() {
  return (
    <div className="App">
      <Field/>
      <Canvas/>
    </div>
  );
}

export default App;

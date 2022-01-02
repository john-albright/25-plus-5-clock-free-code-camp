import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const AdjustmentBlock = props => {

  const [id] = useState(props.id);

  const [number, setNumber] = useState(props.number);

  let content = (

    <div class="adjustment-block">
      <div 
        class = "adjustment-label" 
        id = {id + "-label"}
        >
        {id[0].toUpperCase() + id.slice(1)} Length
      </div>
      <div 
        id = {id + "-decrement"} 
        onClick = {setNumber.bind(this, number - 1 < 0 ? number : number - 1)}
        >
          &#8722;
      </div>
      <div 
        id = {id + "-length"}
        >
          {number}
      </div>
      <div 
        id ={id + "-increment"} 
        onClick = {setNumber.bind(this, number + 1)}
        >
          &#43;
      </div>
    </div>
  );

  return content; 
}

const Timer = props => {

  let content = (
    <div id="timer-block">
      <div id="timer-label">Session</div>
      <div id="time-left"></div>
      <div id="start_stop">*</div>
      <div id="reset">^</div>
    </div>
  );

  return content;
}

const App = props => {

  let content = (
    <div id="main">
      <div id="app-title">25 + 5 Clock</div>
      <AdjustmentBlock 
        id = "break"
        number = {5}
      />
      <AdjustmentBlock 
        id = "session"
        number = {25}
      />
      <Timer 

      />
      
    </div>
  );

  return content;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

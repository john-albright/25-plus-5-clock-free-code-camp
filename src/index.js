import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Global variables
const initialSessionTime = 25;
const initialBreakTime = 5;

const AdjustmentBlock = props => {

  const [id] = useState(props.id);

  const [number, setNumber] = useState(props.number);

  const decrementCount = () => {
    setNumber(number => number - 1 < 0 ? number : number - 1);
  }

  const incrementCount = () => {
    setNumber(number => number + 1 > 60 ? number : number + 1);
    //console.log("adjustment block:", number);
    // props.changeTime(number);
  }

  useEffect(() => props.changeTime(number));

  let content = (

    <div className="adjustment-block">
      <div 
        className = "adjustment-label" 
        id = {id + "-label"}
      >
        {id[0].toUpperCase() + id.slice(1)} Length
      </div>
      <div 
        id = {id + "-decrement"} 
        onClick = { decrementCount }
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
        onClick = { incrementCount }
      >
        &#43;
      </div>
    </div>
  );

  return content; 
}

const Timer = props => {

  const [timeLeft, setTimeLeft] = useState(props.sessionTimeApp);

  const [sessionTime, setSessionTime] = useState(props.sessionTimeApp);

  const [breakTime, setBreakTime] = useState(props.breakTimeApp);

  const reset = () => {
    setTimeLeft(initialSessionTime);
    setSessionTime(initialSessionTime);
    setBreakTime(initialBreakTime);
    props.resetBreak(initialBreakTime);
    props.resetSession(initialSessionTime);
  }

  // const printTimeLeft = () => {
  //   console.log(`time left: ${timeLeft}`);
  // }

  useEffect(() => {
    setTimeLeft(props.sessionTimeApp);
    setSessionTime(props.sessionTimeApp);
    setBreakTime(props.breakTimeApp);
  }, [props.sessionTimeApp, props.breakTimeApp]);

  let content = (
    <div id="timer-block">
      <div id="timer-label">Session</div>
      <div id="time-left">{timeLeft}</div>
      <div id="start_stop">*</div>
      <div id="reset" onClick = {reset}>^</div>
    </div>
  );

  return content;
}

const App = props => {

  const [breakTime, setBreakTime] = useState(initialBreakTime);
  const [sessionTime, setSessionTime] = useState(initialSessionTime);
  //const [reset, setReset] = useState(false);

  const breakUpdate = (number) => {
    setBreakTime(number);
    //console.log(`break time: ${breakTime}`);
  }

  const sessionUpdate = (number) => {
    setSessionTime(number);
    //console.log(`session time: ${sessionTime}`);
  }

  /*
  useEffect(() => {
    if (breakTime === 5 && sessionTime === 25) {
      resetBreakApp(5);
      resetSessionApp()
    }
  });

  const resetBreakApp = () => {

  }

  const resetSessionApp = () => {

  }*/

  /*
  useEffect(() => {
    sendBreakTimeToChild(breakTime);
    sendSessionTimeToChild(sessionTime);
  });

  const sendBreakTimeToChild = (number) => number;
  const sendSessionTimeToChild = (number) => number;*/

  let content = (
    <div id="main">
      <div id="app-title">25 + 5 Clock</div>
      <AdjustmentBlock 
        id = "break"
        number = {initialBreakTime}
        changeTime = {breakUpdate}
        resetBreak = {breakUpdate}
      />
      <AdjustmentBlock 
        id = "session"
        number = {initialSessionTime}
        changeTime = {sessionUpdate}
        resetSession = {sessionUpdate}
      />
      <Timer 
        sessionTimeApp = {sessionTime}
        breakTimeApp = {breakTime}
        //resetBreak = {breakUpdate}
        //resetSession = {sessionUpdate}
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

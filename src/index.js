import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
//import { Provider, connect } from 'react-redux';
//import { createStore } from 'redux';
import './index.css';

// Global variables
const initialSessionTime = 25;
const initialBreakTime = 5;

/*=============
   REDUX CODE
===============*/
/*
const INCREMENT_SESSION = 'INCREMENT_SESSION';
const DECREMENT_SESSION = 'DECREMENT_SESSION';
const INCREMENT_BREAK = 'INCREMENT_BREAK';
const DECREMENT_BREAK = 'DECREMENT_BREAK';
const RESET = 'RESET';

// Actions 

const incrementSession = () => {
  return {
    type: INCREMENT_SESSION
  };
}

const decrementSession = () => {
  return {
    type: DECREMENT_SESSION
  };
}

const incrementBreak = () => {
  return {
    type: INCREMENT_BREAK
  };
}

const decrementBreak = () => {
  return {
    type: DECREMENT_BREAK
  };
}

const reset = () => {
  return {
    type: RESET
  };
}

// Initial state to be used as a default argument in the reducer
const initialState = {
  sessionTime: initialSessionTime,
  breakTime: initialBreakTime
};

// Reducer
const timeReducer = (state = initialState, action) => {
  switch(action.type) {
      case INCREMENT_SESSION:
          return {
              sessionTime: state.sessionTime + 1
          };
      case DECREMENT_SESSION:
          return {
              sessionTime: state.sessionTime - 1
          }
      case INCREMENT_BREAK:
          return {
              breakTime: state.breakTime + 1
          };
      case DECREMENT_BREAK:
          return {
              breakTime: state.breakTime - 1
          }
      case RESET: 
          return  {
            sessionTime: initialSessionTime,
            breakTime: initialBreakTime
          }
      default:
          return state; 
  }
}

*/

/*=============
   REACT CODE
===============*/

const AdjustmentBlock = props => {

  const [id] = useState(props.id);
  const [number, setNumber] = useState(props.number);

  const decrementCount = () => {
    //console.log("allow change:", props.allowChange);
    if (!props.allowChange) {
      setNumber(number => number - 1 < 1 ? number : number - 1);
      //props.changeMade(true);
    }
  }

  const incrementCount = () => {
    if (!props.allowChange) {
      setNumber(number => number + 1 > 60 ? number : number + 1);
      //props.changeMade(true);
    }
  }

  useEffect(() => {
    //console.log(props.toReset);
    if (props.toReset && number !== props.toReset) {
      setNumber(props.toReset);
      props.doneReset(false);
    }
    if (props.toReset === null) props.changeTime(number);
  }, [props, number]);

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
        id = {id + "-increment"} 
        onClick = { incrementCount }
      >
        &#43;
      </div>
    </div>
  );

  return content; 
}

const Timer = props => {

  const [sessionTime, setSessionTime] = useState(props.sessionTimeApp);
  const [breakTime, setBreakTime] = useState(props.breakTimeApp);
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60);
  const [startClock, setStartClock] = useState(false);
  const [onBreak, setOnBreak] = useState(false); 
  const [updateTime, setUpdateTime] = useState(true);
  const [resetTimer, setResetTimer] = useState(false);

  //var timer = React.useRef(null);

  const reset = () => {
    setTimeLeft(initialSessionTime * 60);
    setSessionTime(initialSessionTime);
    setBreakTime(initialBreakTime);
    if (startClock) setStartClock(!startClock);
    props.canAdjust(!startClock);
    props.reset(true);
    setResetTimer(true);
    //props.resetBreak(initialBreakTime);
    //props.resetSession(initialSessionTime);
  }

  const startStopClock = () => {
    setStartClock(!startClock);
    setUpdateTime(!updateTime);
  }

  const convertTime = (seconds) => {
    let secondsLeft = (seconds % 60).toString();
    let minutesLeft = (parseInt(seconds / 60)).toString();

    if (secondsLeft.length === 1) secondsLeft = "0" + secondsLeft;
    if (minutesLeft.length === 1) minutesLeft = "0" + minutesLeft;

    return `${minutesLeft}:${secondsLeft}`;
  }

  useEffect(() => { 

    // Helper function for the startStopClock function
    const reduceTime = () => {
      if (startClock) setTimeLeft(timeLeft - 1);
    }

    props.canAdjust(startClock); // check

    if (startClock) {
      if (timeLeft >= 0) {
        var timer = setTimeout(reduceTime, 1000); 
      } else {
        setOnBreak(!onBreak);

        // Reset timeLeft according to the value of the onBreak variable
        // The varialbe onBreak is not set until the end of the useEffect() function
        if (!onBreak) setTimeLeft(breakTime * 60);
        else setTimeLeft(sessionTime * 60)
      }
    } else {
      clearTimeout(timer);
    }

    if (resetTimer) {
      //clearTimeout(timer);
      setResetTimer(false);
    }

    if (updateTime) { // updateTime
      if ((onBreak && breakTime !== props.breakTimeApp) || (!onBreak && sessionTime !== props.sessionTimeApp) || resetTimer)
        setTimeLeft(props.sessionTimeApp * 60);

      setSessionTime(props.sessionTimeApp);
      setBreakTime(props.breakTimeApp);
    }

    if (!startClock) {
      setUpdateTime(true);
    } else {
      setUpdateTime(false);
    }
  }, [sessionTime, breakTime, startClock, updateTime, timeLeft, onBreak, resetTimer, props]);

  let content = (
    <div id="timer-block">
      <div id="timer-label">
        {!onBreak ? "Session" : "Break"}
      </div>
      <div 
        id="time-left"
      >
        {convertTime(timeLeft)}
      </div>
      <div 
        id="start_stop" 
        onClick = {startStopClock}
      >
        {!startClock ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i>}
      </div>
      <div 
        id="reset" 
        onClick = {reset}
      >
        <i className="fas fa-sync"></i>
      </div>
    </div>
  );

  return content;
}

const App = props => {

  const [breakTime, setBreakTime] = useState(initialBreakTime);
  const [sessionTime, setSessionTime] = useState(initialSessionTime);
  const [timerOn, setTimerOn] = useState(false);
  const [reset, setReset] = useState(false);
  //const [changeMode, setChangeMode] = useState(true);

  const breakUpdate = (number) => {
    setBreakTime(number);
    //console.log(`break time: ${breakTime}`);
  }

  const sessionUpdate = (number) => {
    setSessionTime(number);
    //console.log(`session time: ${sessionTime}`);
  }

  const timerPause = (value) => {
    //console.log("timer pause value:", value);
    if (value === true) {
      setTimerOn(true); 
      //setChangeMode(false);
    }
    if (value === false) {
      setTimerOn(false);
      //setChangeMode(true);
    }
  }

  const resetApp = (value) => {
    if (value === true) {
      setReset(true);
      setTimerOn(false);
    }
    if (value === false) {
      setReset(false);
      setTimerOn(false);
    }
  }

  /*
  const incDecr = (value) => {
    if (value === true) {
      setChangeMode(true);
    } else {
      setChangeMode(false);
    }
  }*/

  useEffect(() => {
    //console.log(breakTime, sessionTime, timerOn);
  });

  let content = (
    <div id="main">
      <div id="app-title">25 + 5 Clock</div>
      <AdjustmentBlock 
        id = "break"
        number = {breakTime} // initial?
        changeTime = {breakUpdate}
        allowChange = {timerOn}
        //changeMade = {incDecr}
        toReset = {reset ? initialBreakTime : null}
        doneReset = {resetApp}
      />
      <AdjustmentBlock 
        id = "session"
        number = {sessionTime} // initial?
        changeTime = {sessionUpdate}
        allowChange = {timerOn}
        //changeMade = {incDecr}
        toReset = {reset ? initialSessionTime : null}
        doneReset = {resetApp}
      />
      <Timer 
        sessionTimeApp = {sessionTime}
        breakTimeApp = {breakTime}
        //allowChange = {changeMode}
        reset = {resetApp}
        canAdjust = {timerPause}
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

import React, { useEffect, useState, useRef } from 'react';
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
      //console.log("decrement" + id);
      //props.changeMade(true);
    }
  }

  const incrementCount = () => {
    if (!props.allowChange) {
      setNumber(number => number + 1 > 60 ? number : number + 1);
      //console.log("increment" + id);
      //props.changeMade(true);
    }
  }

  useEffect(() => {
    //console.log(`${id}: ${number}`);

    //console.log(props.toReset);
    if (props.toReset /* && number !== props.toReset*/) {
      setNumber(props.toReset);
      props.doneReset(false);
    }
    if (props.toReset === null) props.changeTime(number);
  }, [props, id, number]);

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
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const reset = () => {
    setTimeLeft(initialSessionTime * 60);
    setSessionTime(initialSessionTime);
    setBreakTime(initialBreakTime);
    setOnBreak(false);
    if (startClock) {
      setStartClock(!startClock);
      clearTimeout(timerRef);
    }
    if (audioRef.current !== null && audioRef.current !== 0) {
      /* if (!audioRef.current.paused) */
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    props.canAdjust(!startClock);
    props.reset(true);
    setResetTimer(true);
  }

  const startStopClock = () => {
    setStartClock(!startClock);
    setUpdateTime(!updateTime);
    if (startClock) clearTimeout(timerRef); 
  }

  const convertTime = (seconds) => {
    let secondsLeft = (seconds % 60).toString();
    let minutesLeft = (parseInt(seconds / 60)).toString();

    if (secondsLeft.length === 1) secondsLeft = "0" + secondsLeft;
    if (minutesLeft.length === 1) minutesLeft = "0" + minutesLeft;

    return `${minutesLeft}:${secondsLeft}`;
  }

  useEffect(() => { 

    // Load the audio file after the component has loaded 
    /*
    if (audioRef.current == null) {
      //console.log(document.getElementById("beep"));
      audioRef.current = document.getElementById("beep");
      //console.log(audioRef.current);
    }*/

    // Helper function for the startStopClock function
    const reduceTime = () => {
      if (startClock) setTimeLeft(timeLeft - 1);
      //console.log(timeLeft);
    }

    props.canAdjust(startClock); // check

    if (startClock) {
      if (timeLeft > 0) {
        timerRef.current = setTimeout(reduceTime, 1000);
      } else {
        setOnBreak(!onBreak);

        // Reset timeLeft according to the value of the onBreak variable
        // The varialbe onBreak is not set until the end of the useEffect() function
        if (!onBreak) setTimeLeft(breakTime * 60);
        else setTimeLeft(sessionTime * 60)
      }
    } 
    
    /*if (!startClock) {
      clearTimeout(timerRef.current);
    }*/

    if (timeLeft === 0) {
      audioRef.current = document.getElementById("beep");
      audioRef.current.play();
    }

    if (resetTimer) {
      //clearTimeout(timerRef);
      setResetTimer(false);
    }

    if (updateTime) {
      if ((onBreak && breakTime !== props.breakTimeApp) || (!onBreak && sessionTime !== props.sessionTimeApp) || resetTimer)
        setTimeLeft(props.sessionTimeApp * 60);

      setSessionTime(props.sessionTimeApp);
      setBreakTime(props.breakTimeApp);
    }

    // Don't allow the time to be updated if the timer is on
    if (!startClock) {
      setUpdateTime(true);
    } else {
      setUpdateTime(false);
    }

    return () => clearTimeout(timerRef.current);
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
      <audio id="beep" src="mixkit-vintage-warning-alarm-990.wav" type="audio/wav"></audio>
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
    if (value === true) setTimerOn(true); 
    if (value === false) setTimerOn(false);
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

  // Optional code to debug state values 
  useEffect(() => {
    //console.log(breakTime, sessionTime, timerOn);
  });

  let content = (
    <div id="main">
      <div id="app-title">25 + 5 Clock</div>
      <AdjustmentBlock 
        id = "break"
        number = {initialBreakTime}
        changeTime = {breakUpdate}
        allowChange = {timerOn}
        toReset = {reset ? initialBreakTime : null}
        doneReset = {resetApp}
      />
      <AdjustmentBlock 
        id = "session"
        number = {initialSessionTime}
        changeTime = {sessionUpdate}
        allowChange = {timerOn}
        toReset = {reset ? initialSessionTime : null}
        doneReset = {resetApp}
      />
      <Timer 
        sessionTimeApp = {sessionTime}
        breakTimeApp = {breakTime}
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

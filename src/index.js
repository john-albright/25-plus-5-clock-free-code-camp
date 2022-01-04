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
    //console.log("allow change:", !props.allowChange);
    if (!props.allowChange) {
      setNumber(number => number - 1 < 1 ? number : number - 1);
    }
  }

  const incrementCount = () => {
    if (!props.allowChange) {
      setNumber(number => number + 1 > 60 ? number : number + 1);
    }
    //console.log("adjustment block:", number);
    // props.changeTime(number);
  }

  /*
  const reset = (number) => {
    setNumber(number);
  }*/

  useEffect(() => {
    /*console.log(props.reset())
    if (props.reset() !== number) setNumber(props.reset());*/
    props.changeTime(number);
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
  const [startStop, setStartStop] = useState(false);
  const [onBreak, setOnBreak] = useState(false); 

  const reset = () => {
    setTimeLeft(initialSessionTime * 60);
    setSessionTime(initialSessionTime);
    setBreakTime(initialBreakTime);
    if (startStop) setStartStop(!startStop);
    props.canAdjust(!startStop);
    //props.resetBreak(initialBreakTime);
    //props.resetSession(initialSessionTime);
  }

  // const printTimeLeft = () => {
  //   console.log(`time left: ${timeLeft}`);
  // }
  /*
  const reduceTime = () => {
    setTimeLeft(timeLeft - 1);
  }*/

  const startStopClock = () => {
    setStartStop(!startStop);
    //console.log(startStop);
    props.canAdjust(!startStop);
    /*
    var timer = null;

    if (flag) {
      timer = setInterval(reduceTime, 1000);
    } else {
      if (timer != null) clearInterval(timer);
    }

    console.log(`time left: ${timeLeft}`);
    */
    // console.log("after", flag);
  }

  const convertTime = (seconds) => {
    let secondsLeft = (seconds % 60).toString();
    let minutesLeft = (parseInt(seconds / 60)).toString();

    if (secondsLeft.length === 1) secondsLeft = "0" + secondsLeft;
    if (minutesLeft.length === 1) minutesLeft = "0" + minutesLeft;

    return `${minutesLeft}:${secondsLeft}`;
  }

  useEffect(() => {

    const reduceTime = () => {
      setTimeLeft(timeLeft - 1);
    }

    if (startStop) {
      if (timeLeft >= 0) {
        var timer = setTimeout(reduceTime, 1000); 
      } else {
        //setTimeout(reduceTime, 1000);
        setOnBreak(!onBreak);
        setTimeLeft(breakTime * 60);
      }
    } else {
      clearInterval(timer);
    }
    
    if (!startStop) {
      setTimeLeft(props.sessionTimeApp * 60);
      setSessionTime(props.sessionTimeApp);
      setBreakTime(props.breakTimeApp);
    }
  }, [startStop, timeLeft, onBreak, breakTime, props]);

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
        {!startStop ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i>}
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

  const breakUpdate = (number) => {
    setBreakTime(number);
    //console.log(`break time: ${breakTime}`);
  }

  const sessionUpdate = (number) => {
    setSessionTime(number);
    //console.log(`session time: ${sessionTime}`);
  }

  const timerPause = (value) => {
    console.log(value);
    if (value === true) setTimerOn(true); 
    if (value === false) setTimerOn(false);
  }

  /*
  useEffect(() => {
    if (breakTime === 5 && sessionTime === 25) {
      resetBreakApp(initialBreakTime);
      resetSessionApp(initialSessionTime);
    }
  });*/
  
  /*
  const checkAdjustment = (value = undefined) => {
    console.log(value);
    return value === undefined ? true : value;
  }*/

  /*
  const resetBreakApp = () => {
    if (breakTime === initialBreakTime && sessionTime === initialSessionTime) {
      return initialBreakTime;
    } else {
      return null;
    }
    
    //return number;
  }

  const resetSessionApp = () => {
    if (breakTime === initialBreakTime && sessionTime === initialSessionTime) {
      return initialSessionTime;
    } else {
      return null;
    }
    //return number;
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
        allowChange = {timerOn}
        //reset = {resetBreakApp}
      />
      <AdjustmentBlock 
        id = "session"
        number = {initialSessionTime}
        changeTime = {sessionUpdate}
        allowChange = {timerOn}
        //reset = {resetSessionApp}
      />
      <Timer 
        sessionTimeApp = {sessionTime}
        breakTimeApp = {breakTime}
        resetBreak = {breakUpdate}
        resetSession = {sessionUpdate}
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

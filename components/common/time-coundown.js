import React from 'react'
import moment from 'moment'

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          time: moment(props.time).add(1, 'h').diff(moment(), 'minutes') * 60,
          running: true,
        }
        this.handleStart();
    }

    componentDidMount() {
        this.setState({
            time: moment(this.props.time).add(1, 'h').diff(moment(), 'minutes') * 60
        });
        
        this.handleStart();
    }
      
    componentDidUpdate(prevProps, prevState) {
        if(this.state.running !== prevState.running){
            switch(this.state.running) {
                case true:
                    this.handleStart();
            }
        }
    }
      
      handleStart() {
        this.timer = setInterval(() => {
          const newTime = this.state.time - 1;
          this.setState(
            {time: newTime >= 0 ? newTime : 0}
          );
        }, 1000);
      }
      
      handleStop() {
        if(this.timer) {
          clearInterval(this.timer);
          this.setState(
            {running:false}
          );
        }
      }
      
      handleReset() {
        this.setState(
          {time: 0}
        );
      }
      
      handleCountdown(seconds) {
        this.setState({
          time: seconds,
          running: true
        })
      }

    format(time) {
      // let seconds = time % 60;
      // let minutes = Math.floor(time / 60);
      // minutes = minutes.toString().length === 1 ? "0" + minutes : minutes;
      // seconds = seconds.toString().length === 1 ? "0" + seconds : seconds;
      // return minutes + ':' + seconds;
      
      const date = new Date(time * 1000);
      let hh = date.getUTCHours();
      let mm = date.getUTCMinutes();
      let ss = date.getSeconds();
      if (hh < 10) {hh = "0"+hh;}
      if (mm < 10) {mm = "0"+mm;}
      if (ss < 10) {ss = "0"+ss;}
      return '00' !== hh ? hh+":"+mm+":"+ss : mm+":"+ss;
    }
    
    render () {
      const {time} = this.state;
      return (
          <span>{this.format(time)}</span>
      )
    }
}

export default Clock;
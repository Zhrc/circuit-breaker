import React, {Component} from 'react';

const CircuitBreaker = require('opossum');

function asyncFunctionThatCouldFail() {
  const fetchPromise = fetch("/public")
      .then(response => response.json());
      
  return fetchPromise;
}  

const options = {
  timeout: 10000, // If our function takes longer than 10 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 10000, // After 10 seconds, try again.
  // rollingCountTimeout : 60000 // Sets the duration of the statistical rolling window, in milliseconds. This is how long Opossum keeps metrics for the circuit breaker
};

  
class API extends Component {
  state = {
      circuitBreakerState: "closed",      
      message: "",        
  };
  constructor() {
    super();
    this.breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);
    
    this.breaker.on("open",
    () => {
      this.setState({
        circuitBreakerState: "open",
      })
    });
    this.breaker.on("halfOpen",
      () => {
        this.setState({
          circuitBreakerState: "halfOpen",
      })
    });
    this.breaker.on("close",
      () => {
        this.setState({
          circuitBreakerState: "closed",
      })
    });    
  };  
  
  componentDidMount() {
    try {
      setInterval(async () => {
        this.breaker.fire()
            .then((response) => {
                this.setState({
                    message: `Current server time is: ${response.message}`,              
                })
            })
            .catch(() => {
              var currentDate = new Date(); 
              var currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
              this.setState({
                message: `Current local time is: ${currentTime}`,              
            })
              }              
            )
      }, 1000);
    } catch(e) {
      console.log(e);
    }
  }

  render () {
    return (
        <div>
            <h1>API</h1>
            <p>circuitBreakerState: {this.state.circuitBreakerState}</p>
            <p>{this.state.message}</p>
            <p>fires: {(this.breaker.stats.fires)}</p>
            <p>successes: {(this.breaker.stats.successes)}</p>
            <p>failures: {(this.breaker.stats.failures)}</p>

        </div>
      )
    }
}

export default API;
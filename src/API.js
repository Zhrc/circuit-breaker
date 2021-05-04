import React, {Component} from 'react';

const CircuitBreaker = require('opossum');

function asyncFunctionThatCouldFail() {
  const fetchPromise = fetch("/public")
      .then(response => response.json());
      
  return fetchPromise;
}  

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 10000 // After 10 seconds, try again.
};

  
class API extends Component {

  state = {
      circuitBreakerState: "",      
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
                message: `Current server time is: ${currentTime}`,              
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
            <p>circuitBreakerState:{this.state.circuitBreakerState}</p>
            <p>{this.state.message}</p>
            <p>{JSON.stringify(this.breaker.stats)}</p>
        </div>
      )
    }
}

export default API;
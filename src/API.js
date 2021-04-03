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
    resetTimeout: 30000 // After 30 seconds, try again.
  };

const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);

class API extends Component {
    state = {
        time: "",        
      }
    componentDidMount() {
        try {
          setInterval(async () => {
            // const res = await fetch("/public");
            // const response = await res.json();

            // this.setState({
            //   time: response.message,              
            // })
            breaker.fire()
                .then((response) => {
                    this.setState({
                        time: response.message,              
                    })
                })
          }, 1000);
        } catch(e) {
          console.log(e);
        }
  }

    render () {
        return (
            <div>
                <h1>API</h1>
                Current time is: {this.state.time}
            </div>
        )
    }
}

export default API;
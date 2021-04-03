import React, { Component} from 'react';
import {Route} from 'react-router-dom';
import Home from "./Home";
import API from "./API";
import Nav from "./Nav";

class App extends Component {
  render() {
    return (
      <>
        <Nav />
        <div className="body">
          <Route path="/" exact component={Home} />
          <Route path="/API" component={API} />
        </div>
      </>
    );
  }
}

export default App;

import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            {/*<Route path="/eventDetail" component={} />*/}
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
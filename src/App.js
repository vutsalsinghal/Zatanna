import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import UploadSong from './components/UploadSong';
import SongList from './components/SongList';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/Zatanna" component={Home} />
            <Route path="/Zatanna/uploadSong" component={UploadSong} />
            <Route path="/Zatanna/songs" component={SongList} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
import React, { Component } from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import UploadSong from './components/UploadSong';
import mySongs from './components/MySongs';
import SongList from './components/SongList';
import SongDetail from './components/SongDetail';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/Zatanna" component={Home} />
            <Route exact path="/Zatanna/uploadSong" component={UploadSong} />
            <Route exact path="/Zatanna/mySongs" component={mySongs} />
            <Route exact path="/Zatanna/songs" component={SongList} />
            <Route exact path="/Zatanna/songs/detail/:id" component={SongDetail} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
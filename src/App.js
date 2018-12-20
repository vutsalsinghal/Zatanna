import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import UploadSong from './components/UploadSong';
import mySongs from './components/MySongs';
import SongList from './components/SongList';
import SongDetail from './components/SongDetail';
import SearchSong from './components/SearchSong';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          {/*<Switch>*/}
          <Route exact path="/" component={Home} />
          <Route exact path="/uploadSong" component={UploadSong} />
          <Route exact path="/mySongs" component={mySongs} />
          <Route exact path="/songs" component={SongList} />
          <Route exact path="/songs/detail/:id" component={SongDetail} />
          <Route exact path="/searchSongs" component={SearchSong} />
          {/*</Switch>*/}
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
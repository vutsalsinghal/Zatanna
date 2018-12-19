import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Loader, Dimmer, Card } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';

export default class SearchResult extends Component {
  state = {
    songList: [],
    userAccount: '',
    loadingData: false,
    loading: false,
    errorMessage: '',
    msg: '',
    redirect: false,
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Zatanna | Search Results";

    //console.log('this.props.location.songs);
    let songs = this.props.songs;
    if (Array.isArray(songs) && songs.length > 0) {
      try {
        const accounts = await web3.eth.getAccounts();
        this.setState({ userAccount: accounts[0] });

        let songList = [];


        songs.forEach(async (song) => {
          let { artistID, id, name, cost, releaseDate, genere, s3Link } = await ZatannaInstance.methods.songDetail(song["sID"]).call({ from: accounts[0] });
          songList.push([id, name, cost, releaseDate, genere, s3Link, artistID]);
        })

        this.setState({ songList });

      } catch (err) {
        console.log(err.message);
      }
    } else {
      this.setState({ redirect: true });
    }

    this.setState({ loadingData: false });
  }

  renderSongs = () => {
    let items = this.state.songList.map((song, id) => {
      var date = new Date(song[3] * 1000);
      var year = date.getFullYear();
      var month = "0" + (date.getMonth() + 1);
      var day = date.getDate();

      var formattedDate = day + '-' + month.substr(-2) + '-' + year;

      return (
        <Card key={id} href={'/songs/detail/' + song[0]}>
          <Card.Content>
            <Card.Header>{song[1].split('.').slice(0, -1).join('.')}</Card.Header>
            <Card.Meta>
              <span>Cost: {web3.utils.fromWei(song[2], 'ether')} ETH</span>
            </Card.Meta>
            <Card.Description>Release Date: {formattedDate}</Card.Description>
          </Card.Content>
        </Card>

      );
    });

    return <Card.Group>{items}</Card.Group>;
  }

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    return (
      <div>
        <h2>Search Result</h2>
        {!this.state.redirect && this.renderSongs()}
        {this.state.redirect && <Redirect to={{ pathname: "/songs" }} />}
      </div>
    );
  }
}
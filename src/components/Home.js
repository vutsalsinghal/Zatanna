import React, { Component } from 'react';
import { Grid, Loader, Dimmer, Button, Modal, Icon, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { awsSigningRecommendation } from "../utils";
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';
import RegisterUser from './RegisterUser';
import RegisterArtist from './RegisterArtist';

class Home extends Component {
  state = {
    loadingData: false,
    role: '',
    account: '',
    name: '',
    recommededSongs: [],
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Zatanna";

    try {
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({ from: accounts[0] });
      let res = await awsSigningRecommendation();

      let songList = [];
      for (var i = 0; i < res.data.length; i++) {
        let { artistID, id, name, cost, releaseDate, genere, s3Link } = await ZatannaInstance.methods.songDetail(res.data[i]['sID']).call({ from: accounts[0] });
        songList.push([id, name, cost, releaseDate, genere, s3Link, artistID]);
      }

      this.setState({ role, account: accounts[0], recommededSongs: songList });
      this.renderSongs();
    } catch (err) {
      console.log(err.message);
    }
    this.setState({ loadingData: false });
  }

  renderSongs = () => {
    this.setState({ loading: true });
    let items = this.state.recommededSongs.map((song, id) => {
      return (
        <Card key={id} href={'/songs/detail/' + song[0]}>
          <Card.Content>
            <Card.Header>{song[1].split('.').slice(0, -1).join('.')}</Card.Header>
          </Card.Content>
        </Card>
      );
    });
    this.setState({ items, loading: false });
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
        <h1></h1>
        {this.state.role === '0' &&
          <Grid stackable centered>
            <Card fluid color='green'>
              <Card.Content>
                <br /><br />
                <Card.Header><h1>Hi There!</h1></Card.Header>
                <br /><br />
                <h3>Register as </h3>
                <Card.Description>
                  <Button.Group>
                    <Modal size='small'
                      trigger={
                        <Button icon labelPosition='left' className="primary" floated="right">
                          <Icon name='users' />
                          User
                      </Button>
                      }>
                      <Modal.Header>Register as a User to Discover Music</Modal.Header>
                      <Modal.Content>
                        <RegisterUser account={this.state.account} role={this.state.role} />
                      </Modal.Content>
                    </Modal>

                    <Button.Or />

                    <Modal size='small'
                      trigger={
                        <Button icon labelPosition='right' className="primary" floated="right">
                          <Icon name='user' />
                          Artist
                        </Button>
                      }>
                      <Modal.Header>Register as an Artist</Modal.Header>
                      <Modal.Content>
                        <RegisterArtist account={this.state.account} role={this.state.role} />
                      </Modal.Content>
                    </Modal>
                  </Button.Group>
                  <br /><br />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid>
        }

        {this.state.role === '1' &&
          <Grid stackable centered>
            <Card fluid color='green'>
              <Card.Content>
                <br /><br />
                <Card.Header><h1>Hey There Artist!</h1></Card.Header>
                <br /><br />
                <h3>Welcome Back</h3>
                <br />
                <Link to='/uploadSong'>
                  <Button icon labelPosition='left' className="primary">
                    <Icon name='upload' />
                    Upload Song
                  </Button>
                </Link><br /><br /><br />
                <Button.Group>
                  <Link to='/songs'>
                    <Button basic icon labelPosition='right' className="primary">
                      <Icon name='play circle outline' />
                      Discover Songs
                  </Button>
                  </Link>
                  <Link to='/mySongs'>
                    <Button basic icon labelPosition='left' className="primary">
                      <Icon name='cart arrow down' />
                      My Songs
                  </Button>
                  </Link>
                </Button.Group>
                <br /><br />
              </Card.Content>
            </Card>
            <br /><br />
            <h3>Recommended Songs</h3>
            <br /><br /><br /><br />
            <Card.Group>{this.state.items}</Card.Group>
          </Grid>
        }

        {this.state.role === '2' &&
          <Grid stackable centered>
            <Card fluid color='green'>
              <Card.Content>
                <br /><br />
                <Card.Header><h1>Hey There User!</h1></Card.Header>
                <br /><br />
                <h3>Welcome Back</h3>
                <br />
                <Button.Group>
                  <Link to='/songs'>
                    <Button basic icon labelPosition='right' className="primary">
                      <Icon name='play circle outline' />
                      Discover Songs
                  </Button>
                  </Link>
                  <Link to='/mySongs'>
                    <Button basic icon labelPosition='left' className="primary">
                      <Icon name='cart arrow down' />
                      My Songs
                  </Button>
                  </Link>
                </Button.Group>
                <br /><br />
              </Card.Content>
            </Card>
            <br /><br />
            <h3>Recommended Songs</h3>
            <br /><br /><br /><br />
            <Card.Group>{this.state.items}</Card.Group>
          </Grid>
        }
      </div>
    );
  }
}

export default Home;
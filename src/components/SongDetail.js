import React, { Component } from 'react';
import { Loader, Dimmer, Card, Grid, Button, Icon, Modal, Label, Popup } from 'semantic-ui-react';
import axios from 'axios';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';
import Donate from './Donate';
import BuySong from './BuySong';
import { awsSigning } from '../utils.js';
import AudioPlayer from './AudioPlayer';
import './AudioPlayer.css';

class SongDetail extends Component {
  state = {
    purchased: false,
    artistID: '',
    artistName: '',
    id: '',
    name: '',
    cost: '',
    releaseDate: '',
    genre: '',
    role: '',
    userAccount: '',
    componentDetail: {},
    listenCount: 0,
    quotaOver: false,
    loadingData: false,
    loading: false,
    errorMessage: '',
    msg: '',
    ethToUSD: '',
  }

  async componentDidMount() {
    this.setState({ loadingData: true });
    document.title = "Zatanna | Song Detail";

    let ethToUSD = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
    this.setState({ ethToUSD: ethToUSD.data.USD });

    try {
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({ from: accounts[0] });
      this.setState({ role: role, userAccount: accounts[0] });

      if (role === '1' || role === '2') {
        let { artistID, id, name, cost, releaseDate, genre } = await ZatannaInstance.methods.songDetail(this.props.match.params.id).call({ from: accounts[0] });

        if (id !== '0') {  // i.e song exists!
          // Get artist details
          let artistDets = await ZatannaInstance.methods.artistDetail(artistID).call({ from: accounts[0] });
          let userDetail = await ZatannaInstance.methods.userDetail().call({ from: accounts[0] });

          this.setState({ artistID, artistName: artistDets[0], id, name, cost, releaseDate, genre, componentDetail: { "name": "SongDetail", "sID": id, "uID": userDetail[0], "genre": genre } });

          // Send request to AWS
          let purchaseRequest = {
            'retrieve': "SongPurchase",
            'sID': id,
            'uID': userDetail[0],
            'genre': genre
          }
          let response1 = await awsSigning(purchaseRequest, 'v1/dynamoaction');
          if (response1.data.body === true) {
            this.setState({ purchased: true });
          }

          let distributionRequest = {
            'retrieve': "SongDistribution",
            'sID': id,
            'uID': userDetail[0],
          }
          let response2 = await awsSigning(distributionRequest, 'v1/dynamoaction');
          if (response2.data.body) {
            const listenCount = parseInt(response2.data.body[0], 10);
            this.setState({ listenCount });
            if (listenCount > 5 && !this.state.purchased) {                                        // Listen Count (default: 5)
              this.setState({ quotaOver: true });
            }
          }

        } else {
          this.setState({ errorMessage: 'Song does not exists!' });
        }
      }

    } catch (err) {
      console.log(err);
    }

    this.setState({ loadingData: false });
  }

  renderSong = () => {
    if (!this.state.errorMessage) {
      var date = new Date(this.state.releaseDate * 1000);
      var year = date.getFullYear();
      var month = "0" + (date.getMonth() + 1);
      var day = date.getDate();
      var formattedDate = day + '-' + month.substr(-2) + '-' + year;
      var costInEth = parseFloat(web3.utils.fromWei(this.state.cost, 'ether'));
      var costInUSD = parseFloat(costInEth * this.state.ethToUSD).toFixed(4);

      return (
        <Card>
          <Card.Content>
            <AudioPlayer songs={[{
              url: process.env.REACT_APP_bucket_link + this.state.name.split(' ').join('+'),
              cover: "",
              artist: {
                name: this.state.artistName,
                song: this.state.name.split('.').slice(0, -1).join('.')
              }
            }]} componentDetail={this.state.componentDetail} quotaOver={this.state.quotaOver} />
            <Card.Meta>
              <p>Release Date: {formattedDate}</p>
            </Card.Meta>
            <Card.Description>
              {!this.state.purchased &&
                <Popup trigger={
                  <div>
                    Count: <Label><span style={{ color: "#cc0000", fontWeight: "bold" }}>{this.state.listenCount} / 5</span></Label>
                  </div>
                } content='Times you can listen without purchasing!' position='bottom left' />
              }
              <p>Cost: <span style={{ color: "#4285F4", fontWeight: "bold" }}>{costInEth} ETH </span>{'= $'} <span style={{ color: "#cc0000", fontWeight: "bold" }}>{costInUSD} USD</span></p>
            </Card.Description>
          </Card.Content>
        </Card >
      );
    } else {
      return <h3>{this.state.errorMessage}</h3>;
    }
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
        {(this.state.role === '1' || this.state.role === '2') &&
          <div>
            <h2>Song Details:</h2>
            <Grid stackable>
              <Grid.Column width={12}>
                {this.renderSong()}
                <h3>Similar Songs</h3>
              </Grid.Column>
              {!this.state.errorMessage &&
                <Grid.Column width={4}>
                  <Button.Group vertical>
                    <Modal size='small'
                      trigger={
                        <Button icon labelPosition='left' className="primary" floated="right" basic>
                          <Icon name='ethereum' />
                          Donate
                      </Button>
                      }>
                      <Modal.Header>Donate to {this.state.artistName}</Modal.Header>
                      <Modal.Content>
                        <Donate role={this.state.role} userAccount={this.state.userAccount} artistID={this.state.artistID} artistName={this.state.artistName} />
                      </Modal.Content>
                    </Modal>

                    {!this.state.purchased &&
                      <Modal size='small'
                        trigger={
                          <Button icon labelPosition='left' className="primary" floated="right" basic>
                            <Icon name='heart outline' />
                            Buy Song
                        </Button>
                        }>
                        <Modal.Header>Buy This Song</Modal.Header>
                        <Modal.Content>
                          <BuySong role={this.state.role} userAccount={this.state.userAccount} songCost={this.state.cost} songID={this.state.id} songName={this.state.name} genre={this.state.genre} />
                        </Modal.Content>
                      </Modal>
                    }
                  </Button.Group>
                </Grid.Column>
              }
            </Grid>
          </div>
        }

        {this.state.role === '0' &&
          <h2>You are not registered!</h2>
        }
      </div>
    );
  }
}

export default SongDetail;
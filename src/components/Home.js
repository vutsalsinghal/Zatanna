import React, { Component } from 'react';
import {Grid, Loader, Dimmer, Button, Modal, Icon, Card} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';
import RegisterUser from './RegisterUser';
import RegisterArtist from './RegisterArtist';

class Home extends Component {
    state = {
    loadingData:false,
    role:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Zatanna";

    try{
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({from:accounts[0]});
      this.setState({role});
    }catch(err){
      console.log(err);
    }

    this.setState({loadingData:false});
  }



  render() {
    if(this.state.loadingData){
      return (
        <Dimmer active inverted>
        <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    return (
      <div>
        <h1></h1>
        {this.state.role==='0' &&
          <Grid stackable centered>
            <Card fluid color='green'>
              <Card.Content>
                <br /><br />
                <Card.Header><h1>Hi There!</h1></Card.Header>
                <br /><br />
                <h3>Register as </h3>
                <br />
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
                        <RegisterUser />
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
                        <RegisterArtist />
                      </Modal.Content>
                    </Modal>
                  </Button.Group>
                  <br /><br />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid>
        }

        {this.state.role==='1' &&
          <Grid stackable centered>
            <Card fluid color='green'>
              <Card.Content>
                <br /><br />
                <Card.Header><h1>Hey There Artist!</h1></Card.Header>
                <br /><br />
                <h3>Welcome Back</h3>
                <br />
                <Link to='/Zatanna/uploadSong'>
                  <Button basic icon labelPosition='left' className="primary">
                    <Icon name='upload' />
                    Upload Song
                  </Button>
                </Link>
              </Card.Content>
            </Card>
          </Grid>
        }

        {this.state.role==='2' &&
          <Grid stackable centered>
            <Card fluid color='green'>
              <Card.Content>
                <br /><br />
                <Card.Header><h1>Hey There User!</h1></Card.Header>
                <br /><br />
                <h3>Welcome Back</h3>
                <br />
                <Link to='/Zatanna/songs'>
                  <Button basic icon labelPosition='right' className="primary">
                    <Icon name='play circle outline' />
                    Discover Songs
                  </Button>
                </Link>
                <Link to='/Zatanna/mySongs'>
                  <Button basic icon labelPosition='left' className="primary">
                    <Icon name='cart arrow down' />
                    My Songs
                  </Button>
                </Link>
              </Card.Content>
            </Card>
            <h3>Recommended Songs</h3>
          </Grid>
        }
      </div>
    );
  }
}

export default Home;
import React, { Component } from 'react';
import {Grid, Loader, Dimmer, Button, Modal, Icon} from 'semantic-ui-react';
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
        <Grid stackable>
          {this.state.role==='0' &&
            <div>
              <Grid.Row>
                <Grid.Column>
                  <Modal size='small'
                    trigger={
                      <Button icon labelPosition='left' className="primary" floated="right">
                        <Icon name='users' />
                        User Registration
                      </Button>
                    }>
                    <Modal.Header>Register as a User to Discover Music</Modal.Header>
                    <Modal.Content>
                      <RegisterUser />
                    </Modal.Content>
                  </Modal>
                </Grid.Column>
                <Grid.Column>
                  <Modal size='small'
                    trigger={
                      <Button icon labelPosition='left' className="primary" floated="right">
                        <Icon name='user' />
                        Artist Registration
                      </Button>
                    }>
                    <Modal.Header>Register as an Artist</Modal.Header>
                    <Modal.Content>
                      <RegisterArtist />
                    </Modal.Content>
                  </Modal>
                </Grid.Column>
              </Grid.Row>
            </div>
          }

          {this.state.role==='1' &&
            <Button basic icon labelPosition='left' className="primary" floated="right">
              <Icon name='upload' />
              <Link to='/Zatanna/uploadSong'>Upload Song</Link>
            </Button>
          }
        </Grid>
      </div>
    );
  }
}

export default Home;
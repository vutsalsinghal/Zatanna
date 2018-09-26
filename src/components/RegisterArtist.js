import React, { Component } from 'react';
import {Loader, Dimmer, Message, Form, Input, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';

class RegisterArtist extends Component {
  state = {
    loadingData:false,
    loading:false,
    errorMessage:'',
    artistName:'',
    msg:'',
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({errorMessage:'', loading:true, msg:''});

    try{
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({from:accounts[0]});

      if (role === '0'){
        await ZatannaInstance.methods.artistRegister(this.state.artistName).send({from:accounts[0]});
        this.setState({msg:"You've Successfully registered as an Artist"});
      }else{
        if (role === '1') {this.setState({errorMessage:"You've already registered as an Artist"});}
        else {this.setState({errorMessage:"You've already registered as a User"});}
      }
    }catch(err){
      this.setState({errorMessage:err.message, msg:''});
    }

    this.setState({loading:false});
  }

  render() {
    if(this.state.loadingData){
      return (
          <Dimmer active inverted>
            <Loader size='massive'>Loading...</Loader>
          </Dimmer>
      );
    }

    let statusMessage;

    if (this.state.msg === ''){
      statusMessage = null;
    }else{
      statusMessage = <Message floating positive header="Success!" content={this.state.msg} />;
    }

    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Enter Your Name</label>
          <Input value={this.state.value} onChange={event => this.setState({artistName:event.target.value})} />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary basic loading={this.state.loading}>
          Register
        </Button>
        {statusMessage}
      </Form>
    );
  }
}

export default RegisterArtist;
import React, { Component } from 'react';
import {Loader, Dimmer, Message, Form, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';

class RegisterUser extends Component {
  state = {
    loadingData:false,
    loading:false,
    errorMessage:'',
    msg:'',
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({errorMessage:'', loading:true, msg:''});

    try{
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({from:accounts[0]});

      if (role === '0'){
        await ZatannaInstance.methods.userRegister().send({from:accounts[0]});
        this.setState({msg:"You've Successfully registered as a User"});
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
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary basic loading={this.state.loading}>
          Register
        </Button>
        {statusMessage}
      </Form>
    );
  }
}

export default RegisterUser;
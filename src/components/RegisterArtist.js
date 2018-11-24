import React, { Component } from 'react';
import {Loader, Dimmer, Message, Form, Input, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import {awsSigning} from '../utils.js';
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
      if (this.props.role === '0'){
        await ZatannaInstance.methods.artistRegister(this.state.artistName).send({from:this.props.account, value: web3.utils.toWei('0.05','ether')});
        this.setState({msg:"You've Successfully registered as an Artist"});

        // Send request to AWS
        let lastArtist = await ZatannaInstance.methods.lastArtist().call({from:this.props.account});
        let request = {
          'action':"addArtist",
          'aID':lastArtist,
          'aName':this.state.artistName,
          'aAddress':this.props.account
        }

        awsSigning(request,'v1/rdsaction');

      }else{
        if (this.props.role === '1') {this.setState({errorMessage:"You've already registered as an Artist"});}
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
        <Message info>0.05 ETH Joining Fee</Message>
        <Form.Group>
          <Form.Field width={12}>
            <label>Enter Your Name</label>
            <Input value={this.state.value} onChange={event => this.setState({artistName:event.target.value})} />
          </Form.Field>
          <Button size='small' floated='right' primary basic loading={this.state.loading} disabled={this.state.loading}>
            Register
          </Button>
        </Form.Group>
        <Message error header="Oops!" content={this.state.errorMessage} />
        {statusMessage}
      </Form>
    );
  }
}

export default RegisterArtist;
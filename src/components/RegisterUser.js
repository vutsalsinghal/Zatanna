import React, { Component } from 'react';
import {Loader, Dimmer, Message, Form, Button, Dropdown, Input} from 'semantic-ui-react';
import {awsSigning, genreOptions} from '../utils.js';
import ZatannaInstance from '../ethereum/Zatanna';

class RegisterUser extends Component {
  state = {
    loadingData:false,
    loading:false,
    errorMessage:'',
    msg:'',
    name:'',
    likedGenre:[],
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({errorMessage:'', loading:true, msg:''});

    try{
      if (this.props.role === '0'){
        if (this.state.name !== '' && this.state.likedGenre !== []){
          if (this.state.likedGenre.length < 3){
            this.setState({errorMessage:"Choose exactly 3 genres"});
          }else{
            await ZatannaInstance.methods.userRegister(this.state.likedGenre).send({from:this.props.account});
            
            let userDetail = await ZatannaInstance.methods.userDetail().call({from:this.props.account});
            let request = {
              'action':"addUser",
              'uID':userDetail[0],
              'uName':this.state.name,
            }

            // Send request to AWS
            awsSigning(request,'v1/rdsaction');

            this.setState({msg:"You've Successfully registered as a User"});
          }
        }else{this.setState({errorMessage:"Fill all values!"});}
      }else{
        if (this.props.role === '1') {this.setState({errorMessage:"You've already registered as an Artist"});}
        else {this.setState({errorMessage:"You've already registered as a User"});}
      }
      
    }catch(err){
      this.setState({errorMessage:err.message, msg:''});
    }

    this.setState({loading:false});
  }

  handleGenre = (k,{value}) => {
    this.setState({msg:''});

    if (value.length >= 3){
      value = value.slice(0,3);
      //this.setState({msg:"Thanks for choosing 3 genres!"});
    }
    this.setState({likedGenre:value});
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
        <Form.Field width={12}>
          <label>Name</label>
          <Input onChange={event => this.setState({name: event.target.value})} />
        </Form.Field>
        <Form.Group>
          <Form.Field width={12}>
            <label>Choose 3 genres that you like:</label><br/>
            <Dropdown placeholder='Choose Genre' value={this.state.likedGenre} options={genreOptions} search multiple selection onChange={this.handleGenre} />
          </Form.Field>
          <Button primary basic floated='right' loading={this.state.loading} disabled={this.state.loading}>
            Register
          </Button>
        </Form.Group>
        <Message error header="Oops!" content={this.state.errorMessage} />
        {statusMessage}
      </Form>
    );
  }
}

export default RegisterUser;
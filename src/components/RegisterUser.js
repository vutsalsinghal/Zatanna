import React, { Component } from 'react';
import {Loader, Dimmer, Message, Form, Button, Dropdown} from 'semantic-ui-react';
import ZatannaInstance from '../ethereum/Zatanna';
import {genreOptions} from '../utils';

class RegisterUser extends Component {
  state = {
    loadingData:false,
    loading:false,
    errorMessage:'',
    msg:'',
    likedGenre:[],
  }

  onSubmit = async event => {
    console.log(this.state.likedGenre);
    event.preventDefault();
    this.setState({errorMessage:'', loading:true, msg:''});

    try{
      if (this.props.role === '0'){
        await ZatannaInstance.methods.userRegister(this.state.likedGenre).send({from:this.props.account});
        this.setState({msg:"You've Successfully registered as a User"});
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
      this.setState({msg:"Thanks for choosing 3 genres!"});
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
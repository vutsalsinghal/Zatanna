import React, { Component } from 'react';
import {Loader, Dimmer, Message, Form, Button, Input} from 'semantic-ui-react';
import ZatannaInstance from '../ethereum/Zatanna';

class RegisterUser extends Component {
  state = {
    loadingData:false,
    loading:false,
    errorMessage:'',
    msg:'',
    userName:'',
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({errorMessage:'', loading:true, msg:''});

    try{
      if (this.props.role === '0'){
        await ZatannaInstance.methods.userRegister(this.state.userName).send({from:this.props.account});
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
            <label>Enter Your Name</label>
            <Input value={this.state.value} onChange={event => this.setState({userName:event.target.value})} />
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
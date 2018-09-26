import React, { Component } from 'react';
import {Loader, Dimmer, Message, Form, Input, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';

class UploadSong extends Component {
  state = {
    name:'',
    cost:'',
    duration:'',
    genre:'',
    role:'',
    loadingData:false,
    loading:false,
    errorMessage:'',
    msg:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Zatanna | Upload Song";

    try{
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({from:accounts[0]});
      this.setState({role});

    }catch(err){
      console.log(err);
    }
    this.setState({loadingData:false});
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({errorMessage:'', loading:true, msg:''});

    if (this.state.role === '1'){
      try{
        const accounts = await web3.eth.getAccounts();
        await ZatannaInstance.methods.artistUploadSong(this.state.cost, this.state.duration, this.state.name, this.state.genre, "s3link1", "songHash1").send({from:accounts[0]});
        this.setState({msg:"Song Uploaded Successfully!"});
      }catch(err){
        this.setState({errorMessage:err.message, msg:''});
      }
    }else{
      this.setState({errorMessage:"You're not registered as an Artist!"});
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
      <div>
      {this.state.role==='1' &&
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Song Name</label>
            <Input onChange={event => this.setState({name:event.target.value})} />
          </Form.Field>
          <Form.Field>
            <label>Cost</label>
            <Input 
              label="wei"
              labelPosition='right' 
              value={this.state.cost}
              onChange={event => this.setState({cost: event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>Duration</label>
            <Input 
              label="seconds"
              labelPosition='right'
              value={this.state.duration}
              onChange={event => this.setState({cost: event.target.value})}
            />
          </Form.Field>
          <Form.Field>
            <label>Song Genre</label>
            <Input onChange={event => this.setState({genre:event.target.value})} />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary basic loading={this.state.loading}>
            Upload
          </Button>
          {statusMessage}
        </Form>
      }

      {this.state.role!=='1' &&
        <h2>You are not registered as an Artist!</h2>
      }
      </div>
    );
  }
}

export default UploadSong;
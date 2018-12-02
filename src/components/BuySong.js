import React, { Component } from 'react';
import { Loader, Dimmer, Message, Form, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { awsSigning } from '../utils.js';
import ZatannaInstance from '../ethereum/Zatanna';

class BuySong extends Component {
  state = {
    loadingData: false,
    loading: false,
    errorMessage: '',
    amount: '',
    msg: '',
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      if (this.props.role === '1' || this.props.role === '2') {
        //await ZatannaInstance.methods.userBuySong(this.props.songID).send({ from: this.props.userAccount, value: this.props.songCost });
        this.setState({ msg: this.props.songName.split('.').slice(0, -1).join('.') + " - Successfully purchased!" });

        let userDetail = await ZatannaInstance.methods.userDetail().call({ from: this.props.userAccount });
        let dynamoRequest = {
          'action': "SongPurchase",
          'sID': this.props.songID,
          'uID': userDetail[0],
          'genre': this.props.genre
        }

        // Send request to AWS
        awsSigning(dynamoRequest, 'v1/dynamoaction');
      }
    } catch (err) {
      this.setState({ errorMessage: err.message, msg: '' });
    }

    this.setState({ loading: false });
  }

  render() {
    if (this.state.loadingData) {
      return (
        <Dimmer active inverted>
          <Loader size='massive'>Loading...</Loader>
        </Dimmer>
      );
    }

    let statusMessage;

    if (this.state.msg === '') {
      statusMessage = null;
    } else {
      statusMessage = <Message floating positive header="Success!" content={this.state.msg} />;
    }

    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Group>
          <Form.Field width={12}>
            <label>Song Cost: {web3.utils.fromWei(this.props.songCost, 'ether')} ETH</label>
          </Form.Field>
          <Button size='small' floated='right' primary loading={this.state.loading} disabled={this.state.loading}>
            Buy
          </Button>
        </Form.Group>
        <Message error header="Oops!" content={this.state.errorMessage} />
        {statusMessage}
      </Form>
    );
  }
}

export default BuySong;
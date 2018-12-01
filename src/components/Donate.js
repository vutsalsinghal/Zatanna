import React, { Component } from 'react';
import { Loader, Dimmer, Message, Form, Input, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';

class Donate extends Component {
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
      if (this.props.role === '2') {
        await ZatannaInstance.methods.donate(this.props.artistID).send({ from: this.props.userAccount, value: web3.utils.toWei(this.state.amount, 'ether') });
        this.setState({ msg: "You've Successfully donted to " + this.props.artistName });
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
            <label>Enter Donation Amount</label>
            <Input label="ETH" labelPosition='right' onChange={event => this.setState({ amount: event.target.value })} />
          </Form.Field>
          <Button size='small' floated='right' primary loading={this.state.loading} disabled={this.state.loading}>
            Donate
          </Button>
        </Form.Group>
        <Message error header="Oops!" content={this.state.errorMessage} />
        {statusMessage}
      </Form>
    );
  }
}

export default Donate;
import React, { Component } from 'react';
import { Loader, Dimmer, Message, Form, Input, Button, Dropdown } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { awsSigning, genreOptions } from '../utils.js';
import ZatannaInstance from '../ethereum/Zatanna';

class RegisterArtist extends Component {
  state = {
    loadingData: false,
    loading: false,
    errorMessage: '',
    artistName: '',
    likedGenre: [],
    msg: '',
    open: false,
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ errorMessage: '', loading: true, msg: '' });

    try {
      if (this.props.role === '0') {
        if (this.state.artistName !== '' && this.state.likedGenre !== []) {
          if (this.state.likedGenre.length < 3) {
            this.setState({ errorMessage: "Choose exactly 3 genres" });
          } else {
            try {
              await ZatannaInstance.methods.artistRegister(this.state.artistName, this.state.likedGenre).send({ from: this.props.account, value: web3.utils.toWei('0.05', 'ether') });
              this.setState({ msg: "You've Successfully registered as an Artist" });

              // Send request to AWS
              let lastArtist = await ZatannaInstance.methods.lastArtist().call({ from: this.props.account });
              let userDetail = await ZatannaInstance.methods.userDetail().call({ from: this.props.account });

              setTimeout(async () => {
                let userRequest = {
                  'action': "addUser",
                  'uID': userDetail[0],
                  'uName': this.state.artistName,
                }

                // Send request to AWS
                await awsSigning(userRequest, 'v1/rdsaction');

                let artistRequest = {
                  'action': "addArtist",
                  'aID': lastArtist,
                  'uID': userDetail[0],
                  'aName': this.state.artistName,
                  'aAddress': this.props.account
                }

                awsSigning(artistRequest, 'v1/rdsaction');
              }, 1000);
            } catch (e) {
              this.setState({ errorMessage: e.message });
            }
          }
        } else { this.setState({ errorMessage: "Fill all values!" }); }
      } else {
        if (this.props.role === '1') { this.setState({ errorMessage: "You've already registered as an Artist" }); }
        else { this.setState({ errorMessage: "You've already registered as a User" }); }
      }
    } catch (err) {
      this.setState({ errorMessage: err.message, msg: '' });
    }

    this.setState({ loading: false });
  }

  handleGenre = (k, { value }) => {
    this.setState({ msg: '' });

    if (value.length >= 3) {
      value = value.slice(0, 3);
      this.setState({ open: false });
    }
    this.setState({ likedGenre: value });
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
        <Message info>0.05 ETH Joining Fee</Message>
        <Form.Field width={12}>
          <label>Enter Your Name</label>
          <Input value={this.state.value} onChange={event => this.setState({ artistName: event.target.value })} />
        </Form.Field>
        <Form.Group>
          <Form.Field width={12}>
            <label>Choose 3 genres that you like:</label><br />
            <Dropdown placeholder='Choose Genre' open={this.state.open} onClick={() => this.setState({ open: !this.state.open })} value={this.state.likedGenre} options={genreOptions} search multiple selection onChange={this.handleGenre} />
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
import React, { Component } from 'react';
//import { Redirect } from 'react-router';
import { Message, Form, Input, Button, Popup } from 'semantic-ui-react';
import { awsSigningElasticSearch } from '../utils.js';
import SearchResult from './SearchResult';

class SearchSong extends Component {
  state = {
    loading: false,
    errorMessage: '',
    query: '',
    redirect: false,
    songs: [],
    open: false,
  }

  onSubmit = async () => {
    this.setState({ loading: true });

    let res = await awsSigningElasticSearch(this.state.query);
    if (Array.isArray(res.data) && res.data.length > 0) {
      this.setState({ redirect: true, songs: res.data });
    } else {
      this.setState({ open: true });
    }

    this.setState({ loading: false });
  }

  handleRef = node => this.setState({ node })

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Group>
          <Form.Field>
            <Input onChange={event => this.setState({ query: event.target.value, open: false })} />
          </Form.Field>
          <Button size='small' floated='right' primary loading={this.state.loading} disabled={this.state.loading} icon='search'>
          </Button>
          <Popup keepInViewPort context={this.state.node} content='No songs found!' position='right center' open={this.state.open} />
          <div ref={this.handleRef}></div>
        </Form.Group>
        <Message error header="Oops!" content={this.state.errorMessage} />
        {this.state.redirect && <SearchResult songs={this.state.songs} />}
        {/*{this.state.redirect && <Redirect push to={{ pathname: "/searchSongs", songs: this.state.songs }} />}*/}
      </Form>
    );
  }
}

export default SearchSong;
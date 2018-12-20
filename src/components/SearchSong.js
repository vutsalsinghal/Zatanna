import React, { Component } from 'react';
import { Message, Form, Input, Button, Popup, Grid, Card } from 'semantic-ui-react';
import { awsSigningElasticSearch } from '../utils.js';

class SearchSong extends Component {
  state = {
    loading: false,
    errorMessage: '',
    query: '',
    songs: [],
    open: false,
    display: false,
  }

  onSubmit = async () => {
    this.setState({ loading: true });

    let res = await awsSigningElasticSearch(this.state.query);
    if (Array.isArray(res.data) && res.data.length > 0) {
      this.setState({ songs: res.data });
      this.renderSongs();
    } else {
      this.setState({ open: true });
    }
    this.setState({ loading: false });
  }

  renderSongs = () => {
    this.setState({ loading: true });
    let items = this.state.songs.map((song, id) => {
      return (
        <Card key={id} href={'/songs/detail/' + song.sID}>
          <Card.Content>
            <Card.Header>{song.sName.split('.').slice(0, -1).join('.')}</Card.Header>
          </Card.Content>
        </Card>
      );
    });
    this.setState({ items, display: true, loading: false });
  }

  handleRef = node => { this.setState({ node }) }

  render() {
    return (
      <Grid stackable>
        <Card fluid color='green'>
          <Card.Content>
            <Grid.Row>
              <Form size={'tiny'} onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Group inline>
                  <Form.Field>
                    <Input onChange={event => this.setState({ query: event.target.value, open: false, display: false })} />
                  </Form.Field>
                  <Button size='small' floated='right' primary loading={this.state.loading} disabled={this.state.loading} icon='search'>
                  </Button>
                  <Popup keepInViewPort context={this.state.node} content='No songs found!' position='right center' open={this.state.open} />
                  <div ref={this.handleRef}></div>
                </Form.Group>
                <Message error header="Oops!" content={this.state.errorMessage} />
              </Form>
            </Grid.Row>
            {this.state.display &&
              <Grid.Row>
                <Card.Group>{this.state.items}</Card.Group>
              </Grid.Row>
            }

          </Card.Content>
        </Card >
      </Grid>
    );
  }
}

export default SearchSong;
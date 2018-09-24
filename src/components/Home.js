import React, { Component } from 'react';
import {Grid, Loader, Dimmer} from 'semantic-ui-react';

class Home extends Component {
  state = {
    loadingData:false,
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Zatanna";
    this.setState({loadingData:false});
  }



  render() {
    if(this.state.loadingData){
      return (
          <Dimmer active inverted>
            <Loader size='massive'>Loading...</Loader>
          </Dimmer>
      );
    }

    return (
      <div>
        <h1></h1>
        <Grid stackable reversed="mobile">
          <Grid.Column width={12}>
            
          </Grid.Column>
          <Grid.Column width={4}>
            <Grid.Row>
              Sup man!
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Home;
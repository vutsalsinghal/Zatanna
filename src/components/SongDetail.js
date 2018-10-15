import React, { Component } from 'react';
import {Loader, Dimmer, Card} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';

class SongDetail extends Component {
  state = {
    id:'',
    name:'',
    cost:'',
    releaseDate:'',
    genere:'',
    s3Link:'',
    userAccount:'',
    loadingData:false,
    loading:false,
    errorMessage:'',
    msg:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Zatanna | Song Detail";

    try{
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({from:accounts[0]});
      this.setState({role:role, userAccount:accounts[0]});

      if (role === '2'){
        let { id, name, cost, releaseDate, genere, s3Link} = await ZatannaInstance.methods.songDetail(this.props.match.params.id).call({from:accounts[0]});        
        if (id !== '0'){
          this.setState({id,name,cost,releaseDate, genere, s3Link});
        }else{
          this.setState({errorMessage:'Song does not exists!'});
        }
      }

    }catch(err){
      console.log(err);
    }

    this.setState({loadingData:false});
  }

  renderSong = () => {
    if (!this.state.errorMessage){
      var date = new Date(this.state.releaseDate*1000);
      var year = date.getFullYear();
      var month = "0" + (date.getMonth()+1);
      var day = date.getDate();
      var formattedDate = day + '-' + month.substr(-2) + '-' + year;
      
      return (
        <Card>
          <Card.Content>
            <Card.Header>{this.state.name}</Card.Header>
            <Card.Meta>
              <span>Cost: {web3.utils.fromWei(this.state.cost,'ether')} ETH</span>
            </Card.Meta>
            <Card.Description>Release Date: {formattedDate}</Card.Description>
          </Card.Content>
        </Card>
      );
    }else{
      return <h3>{this.state.errorMessage}</h3>;
    }
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
        {this.state.role==='2' &&
          <div>  
            <h2>Song Details:</h2>
            {this.renderSong()}
          </div>
        }

        {this.state.role!=='2' &&
          <h2>You are not registered as an User!</h2>
        }
      </div>
    );
  }
}

export default SongDetail;
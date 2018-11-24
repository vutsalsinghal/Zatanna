import React, { Component } from 'react';
import {Loader, Dimmer, Card} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';

class SongList extends Component {
  state = {
    lastSong:'',
    songList:[],
    role:'',
    userAccount:'',
    loadingData:false,
    loading:false,
    errorMessage:'',
    msg:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Zatanna | Songs";

    try{
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({from:accounts[0]});
      this.setState({role:role, userAccount:accounts[0]});

      if (role === '2' || role === '1'){
        let songList = [];

        const lastSong = await ZatannaInstance.methods.lastSong().call({from:accounts[0]});
        
        if (lastSong > 0){
          for (var i=1; i<=lastSong; i++){
            let {artistID, id, name, cost, releaseDate, genere, s3Link} = await ZatannaInstance.methods.songDetail(i).call({from:accounts[0]});
            songList.push([id, name, cost, releaseDate, genere, s3Link, artistID]);
          }
        }
        this.setState({lastSong, songList});
      }

    }catch(err){
      console.log(err);
    }

    this.setState({loadingData:false});
  }

  renderSongs = () => {
    let items;

    if (this.state.lastSong > 0){
      items = this.state.songList.map((song,id) => {
        var date = new Date(song[3]*1000);
        var year = date.getFullYear();
        var month = "0" + (date.getMonth()+1);
        var day = date.getDate();

        var formattedDate = day + '-' + month.substr(-2) + '-' + year;

        return (
          <Card key={id} href={'/songs/detail/'+song[0]}>
            <Card.Content>
              <Card.Header>{song[1].split('.')[0]}</Card.Header>
              <Card.Meta>
                <span>Cost: {web3.utils.fromWei(song[2],'ether')} ETH</span>
              </Card.Meta>
              <Card.Description>Release Date: {formattedDate}</Card.Description>
            </Card.Content>
          </Card>
        );
      });
    }else{
      return (
        <Card>
          <Card.Content>
            <Card.Header>No Songs yet!</Card.Header>
          </Card.Content>
        </Card>
      );
    }

    return <Card.Group>{items}</Card.Group>;
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
        {(this.state.role==='1' || this.state.role==='2') &&
          <div>  
            <h2>Discover The Expanse!</h2>
            {this.renderSongs()}
          </div>
        }

        {this.state.role==='0' &&
          <h2>You are not registered!</h2>
        }
      </div>
    );
  }
}

export default SongList;
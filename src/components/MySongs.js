import React, { Component } from 'react';
import {Loader, Dimmer, Card} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';
import AudioPlayer from './AudioPlayer';
import './AudioPlayer.css';

class mySongs extends Component {
  state = {
    userID:'',
    purchasedSongs:[],
    role:'',
    userAccount:'',
    loadingData:false,
    loading:false,
    errorMessage:'',
    msg:'',
    playlist:'',
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Zatanna | My Songs";

    try{
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({from:accounts[0]});
      this.setState({role:role, userAccount:accounts[0]});

      if (role === '1' || role === '2'){
        let playlist = [];
        let user_details = await ZatannaInstance.methods.userDetail().call({from:accounts[0]});
        
        for (var i=0; i<user_details[2].length; i++){
          let song = await ZatannaInstance.methods.songDetail(user_details[2][i]).call({from:accounts[0]});
          //{aID, sID, name, cost, releaseDate, genre}
          let artistDetail = await ZatannaInstance.methods.artistDetail(song[0]).call({from:accounts[0]});
          let d = {
            url:"https://s3.amazonaws.com/zatanna-music-upload/songs/"+song[2].split(' ').join('+'),
            cover:"",
            artist:{
              name: artistDetail[0],
              song:song[2].split('.').slice(0,-1).join('.')
            },
            cost:song[3],
            releaseDate:song[4]
          }

          playlist.push(d);
        }
        this.setState({playlist});
      }

    }catch(err){
      console.log(err.message);
    }

    this.setState({loadingData:false});
  }

  renderSongs = () => {
    let items;

    items = this.state.playlist.map((song,id) => {
      var date = new Date(song['releaseDate']*1000);
      var year = date.getFullYear();
      var month = "0" + (date.getMonth()+1);
      var day = date.getDate();
      var formattedDate = day + '-' + month.substr(-2) + '-' + year;

      return (
        <Card key={id}>{/* href={'/songs/detail/'+song[1]}>*/}
          <Card.Content>
            <AudioPlayer songs={[{
              url:song['url'],
              cover:"",
              artist:{
                name:song['artist']['name'],
                song:song['artist']['song']
              }
            }]} />
            <Card.Meta>Cost: {web3.utils.fromWei(song['cost'],'ether')} ETH</Card.Meta>
            <Card.Description>Release Date: {formattedDate}</Card.Description>
          </Card.Content>
        </Card>
      );
    });
    
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
            <h2>List of Purchased Songs</h2>
            {this.state.playlist.length<0 &&
              <h3>No Songs Purchased!</h3>
            }

            {this.state.playlist.length>0 &&
              this.renderSongs()
            }
          </div>
        }

        {this.state.role==='0' &&
          <h2>You are not registered!</h2>
        }
      </div>
    );
  }
}

export default mySongs;
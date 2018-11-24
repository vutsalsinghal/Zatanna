import React, { Component } from 'react';
import {Loader, Dimmer, Card} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import ZatannaInstance from '../ethereum/Zatanna';
import ReactAudioPlayer from 'react-audio-player';

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
  }

  async componentDidMount(){
    this.setState({loadingData:true});
    document.title = "Zatanna | My Songs";

    try{
      const accounts = await web3.eth.getAccounts();
      const role = await ZatannaInstance.methods.getRole().call({from:accounts[0]});
      this.setState({role:role, userAccount:accounts[0]});

      if (role === '1' || role === '2'){
        let purchasedSongs = [];
        let user_details = await ZatannaInstance.methods.userDetail().call({from:accounts[0]});
        
        for (var i=0; i<user_details[2].length; i++){
          let song = await ZatannaInstance.methods.songDetail(user_details[2][i]).call({from:accounts[0]});
          purchasedSongs.push(song);
          //let {aID, sID, name, cost, releaseDate, genre} = await ZatannaInstance.methods.songDetail(i).call({from:accounts[0]});
        }

        this.setState({purchasedSongs});
      }

    }catch(err){
      console.log(err.message);
    }

    this.setState({loadingData:false});
  }

  renderSongs = () => {
    let items;

    if (this.state.purchasedSongs.length > 0){
      items = this.state.purchasedSongs.map((song,id) => {
        var date = new Date(song[4]*1000);
        var year = date.getFullYear();
        var month = "0" + (date.getMonth()+1);
        var day = date.getDate();

        var formattedDate = day + '-' + month.substr(-2) + '-' + year;

        return (
          <Card key={id} href={'/songs/detail/'+song[1]}>
            <Card.Content>
              <Card.Header>{song[2].split('.')[0]}</Card.Header>
              <Card.Meta>
                <span>Cost: {web3.utils.fromWei(song[3],'ether')} ETH</span>
              </Card.Meta>
              <Card.Description>Release Date: {formattedDate}</Card.Description>
              <ReactAudioPlayer
                src={"https://s3.amazonaws.com/zatanna-music-upload/songs/"+song[2].split(' ').join('+')}
                controls
                controlsList="nodownload"
                volume={0.03}
              />
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
            <h2>List of Purchased Songs</h2>
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

export default mySongs;
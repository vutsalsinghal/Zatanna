pragma solidity ^0.4.24;

contract Zatanna{
 uint public lastSong;
 uint public lastUser;
 uint public lastArtist;
 
 struct User{
    uint id;
    uint[] purchasedSongs;
 }
 
 struct Artist{
    string name;
    address artistAddress;
    uint id;
    uint[] songsUploaded;
 }
 
 struct Song{
    uint artistId;
    uint cost;
    uint id;
    uint duration;
    uint releaseDate;
    string name;
    string genre;
    string s3link;
 }
 
 enum ROLE {UNREGISTERED, ARTIST, USER}                                         // Keep track of type of user
 
 mapping (uint => Artist) public idToArtist;
 mapping (address => uint) artistId;
 mapping (address => User) userId;
 mapping (uint => Song) idToSong;
 mapping (string => Song) hashToSong;                                           // To keep track of unique uploads
 mapping (address => ROLE) role;
 
 constructor() public{
    lastSong = 0;
    lastUser = 0;
    lastArtist = 0;
 }
 
 // Returns user type
 function getRole() view external returns(ROLE){
     return role[msg.sender];
 }
 
 function userRegister() external{
    require(userId[msg.sender].id == 0, 'Already registered!');
    
    lastUser += 1;
    
    User memory newUser = User(lastUser, new uint[](0));
    userId[msg.sender] = newUser;
    role[msg.sender] = ROLE.USER;                                               // Update role
 }
 
 function artistRegister(string _name) external{
    require(artistId[msg.sender] == 0, 'Already registered!');
    
    lastArtist += 1;
    
    Artist memory newArtist = Artist(_name, msg.sender, lastArtist, new uint[](0));
    
    artistId[msg.sender] = lastArtist;
    idToArtist[lastArtist] = newArtist;
    role[msg.sender] = ROLE.ARTIST;                                             // Update role
 }
 
 
 // Add Song details and update Artist's details
 function artistUploadSong(uint _cost, uint _duration, string _name, string _genre, string _s3link, string songHash) external{
    require(role[msg.sender] == ROLE.ARTIST, 'Not an artist');                  // Only people registered as artists can upload
    require(artistId[msg.sender] != 0, 'Not a registered Artist');              // Has to be a registered artist
    require(hashToSong[songHash].id == 0, "Can't upload duplicate");            // Has to be a unique song

    lastSong += 1;
    
    Artist artistInstance = idToArtist[artistId[msg.sender]];
    artistInstance.songsUploaded.push(lastSong);                                // Update Artist instance

    // Map SongID to Song
    idToSong[lastSong] = Song(artistInstance.id, _cost, lastSong, _duration, now, _name, _genre, _s3link);
    
    hashToSong[songHash] = idToSong[lastSong];                                  // Update hashToSong dictionary
 }
 
 // When user buys song
 function userBuySong(uint songID) payable external{
    require(role[msg.sender] == ROLE.USER, 'Not a user');                       // Only people registered as USERS can purchase
    require(idToSong[songID].id != 0, 'Song does not exists!');
    require(msg.value == idToSong[songID].cost);                                // Check if song cost is paid
    
    userId[msg.sender].purchasedSongs.push(songID);
    uint artistID = idToSong[songID].artistId;

    idToArtist[artistID].artistAddress.transfer(msg.value);                     // Transfer money to artist
 }
 
 // Returns user profile
 function userDetail() view external returns(uint, uint[]){
    return (userId[msg.sender].id, userId[msg.sender].purchasedSongs);
 }
 
 // When user checks Artist's profile
 function artistDetail(uint _artistID) view external returns(string , uint[] ){
    return (idToArtist[_artistID].name, idToArtist[_artistID].songsUploaded);
 }
 
 // Returns song details
 function songDetail(uint _songId) view external returns(uint cost, uint releaseDate, string name, string genre, string s3link){
    cost = idToSong[_songId].cost;
    releaseDate = idToSong[_songId].releaseDate;
    name = idToSong[_songId].name;
    genre = idToSong[_songId].genre;
    s3link = idToSong[_songId].s3link;
 }
}
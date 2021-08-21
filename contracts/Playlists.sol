pragma solidity >=0.8.0;

contract Playlists {
  uint public totalPlaylist;
  uint public totalSong;

  mapping(uint => Playlist) public playlists;
  mapping(uint => Song) public songs;

  constructor(){
    totalPlaylist = 0;
    totalSong = 0;
  }
  event PlaylistCreated(uint id, string name,address creator,uint songs);
  event SongAdded(uint id,uint playlistId,string name,address creator );

  struct Playlist{
    uint id;
    string name;
    address creator;
    uint songs;
  }
  
  struct Song{
    uint id;
    uint playlistId;
    string name;
    address creator;
  }

 

  function createPlaylist(string memory _name) external {
    require(bytes(_name).length > 0 , "Name can not be empty");
    totalPlaylist += 1;
    playlists[totalPlaylist] = Playlist(totalPlaylist,_name,msg.sender,0);
    emit PlaylistCreated(totalPlaylist, _name, msg.sender, 0);
  
  }

  function addSongToPlaylist(string memory _name, uint _playlistId)  external {  
    require(_playlistId <= totalPlaylist,"Wrong playlist id");
    totalSong += 1;
    songs[totalSong] = Song(totalSong,_playlistId,_name,msg.sender);
    playlists[_playlistId].songs += 1;

    emit SongAdded(totalSong, _playlistId, _name,msg.sender);

  }

  function getPlaylistSongs(uint _playlistId) external view returns(Song[] memory){
    require(_playlistId <= totalPlaylist,"Wrong playlist id");
    uint songSize = playlists[_playlistId].songs;
    
    Song[] memory _songs = new Song[](songSize);

    uint currentIndex = 0;
    for(uint i=1;i<=totalSong;i++){
      if(songs[i].playlistId == _playlistId){
        _songs[currentIndex] = songs[i];
        currentIndex += 1;
      }
    }
    return _songs;
  }

}
import './App.css';
import React from 'react';
import {Grid} from 'semantic-ui-react';
import { connect } from 'react-redux';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';


const App = ({currentUser,currentChannel})=>(
  <Grid columns="equal" className='app' style={{background:'#eee'}}>
    <ColorPanel/>
    <SidePanel
      key={currentUser && currentUser.id}
      currentUser={currentUser}
    />
    <Grid.Column style={{ marginLeft : 360}}>
      <Messages
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
      />
    </Grid.Column>
    
    <Grid.Column width={4}>
      <MetaPanel/>
    </Grid.Column>
    
  </Grid>
)

const mapStateToProps = state =>(
  {
    currentUser: state.user.currentUser,
    currentChannel:state.channel.currentChannel
  }
)

export default connect(mapStateToProps)(App);

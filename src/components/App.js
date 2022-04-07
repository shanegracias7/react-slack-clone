import './App.css';
import React from 'react';
import {Grid} from 'semantic-ui-react';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';


const App = ()=>(
  <Grid columns="equal" className='app' style={{background:'#eee'}}>
    <ColorPanel/>
    <SidePanel/>
    <Grid.Column Style={{ marginleft : 360}}>
      <Messages/>
    </Grid.Column>
    
    <Grid.Column width={4}>
      <MetaPanel/>
    </Grid.Column>
    
  </Grid>
)

export default App;

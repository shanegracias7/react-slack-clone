import React from "react";
import firebase from "../../firebase";
import { Dropdown, Grid, Header, Icon } from "semantic-ui-react";

class UserPanel extends React.Component{

    DropdownOptions = ()=>[
        {
            key: 'user',
            text:<span>Signed in as <strong>user</strong></span>,
            disabled:true
        },
        {
            key: 'avatar',
            text:<span>change avatar</span>
        },
        {
            key: 'signout',
            text:<span onClick={this.handleSignout}>sign out</span>
        }
    ]

    handleSignout = ()=>{
        firebase
        .auth()
        .signOut()
        .then(()=>{console.log("user signed out ")})
    }
    render(){
        return(
            <Grid style={{background:"#4c3c4c"}}> 
                <Grid.Column>
                    {/*App Header*/}
                    <Grid.Row style={{padding:'#1.2em', margin:0}}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="mail"></Icon>
                            <Header.Content>Ping</Header.Content>
                        </Header>                   
                    </Grid.Row>

                    {/*user dropdown*/}
                    <Header inverted  as="h2" style={{padding:'0.25em'}}>
                        <Dropdown 
                            trigger={
                                <span>user</span>
                            }
                            options={this.DropdownOptions()}/>
                    </Header>
                </Grid.Column>
            </Grid>
        )   
    }
}

export default UserPanel;
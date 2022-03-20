import React from "react";
import {Grid,Form,Segment,Button,Header,Message,Icon} from "semantic-ui-react";
import {Link} from 'react-router-dom'

class Register extends React.Component{

    state = {};
    handleChange = () => {};

    render(){
        return(
            <Grid textAlign="center" verticalAlign="middle" className="app" >
        <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" icon color="blue" textAlign="center">
                <Icon name="signup" color="blue" />
                Register for Ping
            </Header>
            <Form size="large">
                <Segment stacked>
                     <Form.Input fluid name="username" icon="user" iconPosition="left" placeholder="username" onChange={this.handleChange} type="text" />
                     <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="email" onChange={this.handleChange} type="email" />
                     <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="password" onChange={this.handleChange} type="password" />
                     <Form.Input fluid name="confirmpassword" icon="repeat" iconPosition="left" placeholder="confirm password" onChange={this.handleChange} type="password" />
                     <Button fluid color="blue" size="large">submit</Button>
                     
                </Segment>
            </Form>
            <Message>Already a user? <Link to="/login">login</Link> </Message>      
        </Grid.Column>
      </Grid>
        )
    }
}

export default Register; 
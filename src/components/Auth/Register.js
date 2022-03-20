import React from "react";
import {Grid,Form,Segment,Button,Header,Message,Icon} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import firebase from '../../firebase';

class Register extends React.Component{

    state = {
        username: '',
        email: '',
        password: '',
        confirmpassword:'',
        errors: ''
    };

    isFormValid = ()=>{

        let errors = [];
        let error;

        if(this.isformEmpty(this.state)){
            error = {message:'fill in all the fields'};
            this.setState({errors: errors.concat(error)});
            return false;
        }
        else if(! this.isPasswordValid(this.state)){
            error= { message: 'invalid passsword'}
            this.setState({errors: errors.concat(error)})
        }
        else {
            //form is valid
            return true;
        }

         
    }

    isPasswordValid = ({password,confirmpassword})=>{
        if(password.length<6 || confirmpassword<6){
            return false;
        }
        else if( password !== confirmpassword ){
            return false;
        }
        else{
            return true;
        }
    }
    isformEmpty = ({username,email,password,confirmpassword})=>{
        return !username.length || !email.length || !password.length || !confirmpassword;

    }


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    };
    handleSubmit = event => {
        if(this.isFormValid())
        {
            event.preventDefault();
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email,this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                })
                .catch(err => {
                    console.error(err);
                })
        }
        
            
    };
    displayError = errors => errors.map((error,i) => <p key={i}>{error.message}</p>);

    render(){
        const {username,email,password,confirmpassword,errors}=this.state;
        return(
            <Grid textAlign="center" verticalAlign="middle" className="app" >
        <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" icon color="blue" textAlign="center">
                <Icon name="signup" color="blue" />
                Register for Ping
            </Header>
            <Form onSubmit={this.handleSubmit} size="large">
                <Segment stacked>
                     <Form.Input fluid name="username" value={username} icon="user" iconPosition="left" placeholder="username" onChange={this.handleChange} type="text" />
                     <Form.Input fluid name="email" value={email} icon="mail" iconPosition="left" placeholder="email" onChange={this.handleChange} type="email" />
                     <Form.Input fluid name="password" value={password} icon="lock" iconPosition="left" placeholder="password" onChange={this.handleChange} type="password" />
                     <Form.Input fluid name="confirmpassword" value={confirmpassword} icon="repeat" iconPosition="left" placeholder="confirm password" onChange={this.handleChange} type="password" />
                     <Button fluid color="blue" size="large">submit</Button>
                </Segment>
            </Form>
            {errors.length>0 && (
                <Message error>
                    <h3>ERROR</h3>
                    {this.displayError(errors)}
                </Message>
                ) 
            }
            <Message>Already a user? <Link to="/login">login</Link> </Message>       
        </Grid.Column>
      </Grid>
        )
    }
}

export default Register; 
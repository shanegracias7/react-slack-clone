import React from "react";
import {Grid,Form,Segment,Button,Header,Message,Icon} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends React.Component{

    state = {
        username: '',
        email: '',
        password: '',
        confirmpassword:'',
        errors: [],
        loading: false,
        
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
            error= { message: 'invalid password'}
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
        event.preventDefault();
        if(this.isFormValid())
        {
            this.setState({errors:[], loading:true })
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email,this.state.password)
                .then(createdUser => {
                    console.log('new user created');
                    createdUser.user.updateProfile({
                        displayName : this.state.username,
                        photoURL : `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(()=>{
                        return firebase.database().ref("users").child(createdUser.user.uid).set({
                            name: createdUser.user.displayName,
                            avatar: createdUser.user.photoURL
                          });
                    })
                    .catch(err => {
                        this.setState({errors: this.state.errors.concat(err), loading:false })
                    })
                    console.log(createdUser);
                    
                })
                .catch(err => {
                    console.error(err);
                    this.setState({errors: this.state.errors.concat(err), loading:false })
                    
                })
        }
        
            
    };
    

    displayError = errors => errors.map((error,i) => <p key={i}>{error.message}</p>);

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName))
          ? "error"
          : "";
      };

    render(){
        const {username,email,password,confirmpassword,errors,loading}=this.state;
        return(
            <Grid textAlign="center" verticalAlign="middle" className="app" >
        <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" icon color="blue" textAlign="center">
                <Icon name="signup" color="blue" />
                Register for Ping
            </Header>
            <Form onSubmit={this.handleSubmit} size="large">
                <Segment stacked>
                     <Form.Input fluid  className={this.handleInputError(errors, "username")}   name="username"        value={username}          icon="user"     iconPosition="left" placeholder="username"          onChange={this.handleChange} type="text" />
                     <Form.Input fluid  className={this.handleInputError(errors, "email")}      name="email"           value={email}             icon="mail"     iconPosition="left" placeholder="email"             onChange={this.handleChange} type="email" />
                     <Form.Input fluid  className={this.handleInputError(errors, "password")}   name="password"        value={password}          icon="lock"     iconPosition="left" placeholder="password"          onChange={this.handleChange} type="password" />
                     <Form.Input fluid  className={this.handleInputError(errors, "password")}   name="confirmpassword" value={confirmpassword}   icon="repeat"   iconPosition="left" placeholder="confirm password"  onChange={this.handleChange} type="password" />
                     <Button  disabled={loading} className={loading? 'loading':''} fluid color="blue" size="large">submit</Button>
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
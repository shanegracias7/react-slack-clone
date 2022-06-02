import React from "react";
import firebase from "../../firebase";
import { Dropdown, Grid, Header, Icon, Image ,Modal,Input,Button } from "semantic-ui-react";
import AvatarEditor from 'react-avatar-editor'

class UserPanel extends React.Component{

    state ={
        user: this.props.currentUser,
        modal:false,
        previewImage:'',
        croppedImage: '',
        blob: ''
    }

    openModal = ()=>{
        this.setState({modal:true})
    }
    closeModal = ()=>{
        this.setState({modal:false})
    }

    DropdownOptions = ()=>[
        {
            key: 'user',
            text:<span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled:true
        },
        {
            key: 'avatar',
            text:<span onClick={this.openModal}>change avatar</span>
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

    handleChange = event=>{
        const file = event.target.files[0]
        const reader = new FileReader()

        if(file){
            reader.readAsDataURL(file)
            reader.addEventListener('load',()=>{
                this.setState({previewImage:reader.result})
            })
        }
    }
    handleCropImage = () => {
        if (this.avatarEditor) {
          this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
            let imageUrl = URL.createObjectURL(blob);
            this.setState({
              croppedImage: imageUrl,
              blob
            });
          });
        }
      }
    
    render(){

        const {user,modal,previewImage,croppedImage} = this.state;
        return(
            <Grid style={{background:"#4c3c4c"}}> 
                <Grid.Column>
                    {/*App Header*/}
                    <Grid.Row style={{padding:'#1.2em', margin:0}}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="mail"></Icon>
                            <Header.Content>Ping</Header.Content>
                        </Header>
                        {/*user dropdown*/}
                        <Header inverted  as="h4" style={{padding:'0.25em'}}>
                            <Dropdown 
                                trigger={
                                    <span>
                                        <Image src={user.photoURL} spaced='right' avatar/>
                                        {user.displayName}
                                    </span>
                                }
                                options={this.DropdownOptions()}/>
                        </Header>                   
                    </Grid.Row>
                    {/*change avatar modal*/}
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                                onChange={this.handleChange}
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {previewImage&&( 
                                            <AvatarEditor
                                            ref={node => (this.avatarEditor = node)}
                                            image={previewImage}
                                            width={250}
                                            height={250}
                                            border={20}
                                            scale={1.2}
                                          />
                                        )}  
                                    </Grid.Column>
                                    <Grid.Column>
                                            {croppedImage&&(
                                                <Image
                                                    style={{margin:'3.5em auto'}}
                                                    width={250}
                                                    height={250}
                                                    src={croppedImage}
                                                />
                                            )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            {croppedImage&&(
                                <Button color="green" inverted>
                                    <Icon name="save"/>Change Avatar
                                </Button>
                            )}
                            <Button color="green" inverted onClick={this.handleCropImage}>
                                <Icon name="image"/>Preview
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove"/>Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                    
                </Grid.Column>
            </Grid>
        )   
    }
}

export default UserPanel;
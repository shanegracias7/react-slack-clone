import React from "react";
import {Menu, Icon, Modal, Form ,Input, Button} from 'semantic-ui-react'

class Channels extends React.Component{
    
    state = {
        channels:[],
        modal:false,
        channelName:"",
        channelDetails:""
    }
    
    closeModal = ()=>this.setState({modal:false});
    openModal = ()=>this.setState({modal:true});

    handleChange = event=>{
        this.setState({[event.target.name]:event.target.value});
    }

    render(){

        const {channels , modal} = this.state;

        return(
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" />CHANNELS
                        </span>
                        {" "}({channels.length})<Icon name="add" onClick={this.openModal}/>
                    </Menu.Item>
                </Menu.Menu>

                <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <Input
                                    fluid
                                    label="Name of the Channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                        </Form.Field>
                    </Form>

                    <Form>
                        <Form.Field>
                            <Input
                                    fluid
                                    label="About the channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                        </Form.Field>
                    </Form>
                </Modal.Content> 
                <Modal.Actions>
                    <Button color="green" inverted>
                        <Icon name="checkmark"/> add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove"/> Cancel
                    </Button>
                </Modal.Actions>
                </Modal>
            </React.Fragment>

            
        );
    }
}

export default Channels;
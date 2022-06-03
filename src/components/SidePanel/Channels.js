import React from "react";
import {Menu, Icon, Modal, Form ,Input, Button,Label} from 'semantic-ui-react'
import firebase from "../../firebase";
import {connect} from 'react-redux';
import { setCurrentChannel ,setPrivateChannel } from '../../actions';

class Channels extends React.Component{
    
    state = {
        channels:[],
        channel: null,
        modal:false,
        channelName:"",
        channelDetails:"",
        channelRef:firebase.database().ref('channels'),
        messageRef:firebase.database().ref('messages'),
        notifications:[],
        user:this.props.currentUser,
        firstLoad:true,
        activeChannel:'',
        typingRef:firebase.database().ref('typing'),
    }

    componentDidMount(){
        this.addListner();
    }
    componentWillUnmount(){
        this.removeListner();
    }
    removeListner = ()=>{
        this.state.channelRef.off();
    }
    addListner = ()=>{
        let loadedChannels=[];
        this.state.channelRef.on('child_added',snap=>{
            loadedChannels.push(snap.val());
            this.setState({channels:loadedChannels},()=>this.setFirstChannel());
            this.addNotificationListner(snap.key)
        })
        
    }
    addNotificationListner = (channelId) =>{
        this.state.messageRef.child(channelId).on('value',snap=>{
            if(this.state.channel){
                this.handleNotification(channelId,this.state.channel.id,this.state.notifications,snap)
            }
        })
    }

    handleNotification = (channelId,currentChannelId,notifications,snap)=>{
        let lastTotal=0
        let index = notifications.findIndex(notification=>notification.id === channelId)

        if(index !== -1){
            if(channelId !== currentChannelId){
                lastTotal = notifications[index].total
                
                if(snap.numChildren()-lastTotal >0){
                    notifications[index].count = snap.numChildren()-lastTotal
                }
                notifications[index].lastKnownTotal = snap.numChildren()
            }
        }
        else{
            notifications.push({
                id:channelId,
                total:snap.numChildren(),
                lastKnownTotal:snap.numChildren(),
                count:0
            })
        }

        this.setState({notifications})
    }
    
    setFirstChannel = ()=>{
        const firstChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length>0){
            this.props.setCurrentChannel(firstChannel)
            this.setActiveChannel(firstChannel)
            this.setState({channel:firstChannel})
        }
        this.setState({firstLoad:false})
    }
    closeModal = ()=>this.setState({modal:false});
    openModal = ()=>this.setState({modal:true});

    addChannel = () =>{
        const {channelRef,channelDetails,channelName,user} = this.state;
        const key = channelRef.push().key;
        const newChannel = {
            id:key,
            name:channelName,
            details:channelDetails,
            createdBy:{
                name:user.displayName,
                avatar:user.photoURL
            }
        }

        channelRef
            .child(key)
            .update(newChannel)
            .then(()=>{
                this.setState({channelDetails:'',channelName:''})
                this.closeModal();
                console.log('channel added')
                
            })
            .catch(err=>{
                console.error(err)
            })
    }

    handleSubmit = event=>{
        event.preventDefault();
        if(this.isFormValid(this.state)){
            console.log('New: '+ this.state.channelName+' Channel Created')
            this.addChannel();
        }
    }

    handleChange = event=>{
        this.setState({[event.target.name]:event.target.value});
    }

    isFormValid = ({channelName, channelDetails})=> channelName&&channelDetails

    displayChannels = channels=>
                        channels.length > 0 && 
                        channels.map(channel=>(
                            <Menu.Item
                                key={channel.id}
                                onClick={()=>this.changeChannel(channel)}
                                name={channel.name}
                                style={{ opacity:0.7}}
                                active={channel.id===this.state.activeChannel}
                            >
                                {this.getNotificationCount(channel)&&(
                                    <Label color="red">{this.getNotificationCount(channel)}</Label>
                                )}
                                #{channel.name}
                            </Menu.Item>
                            )
                        );
    changeChannel = channel =>{
        this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove()
        this.clearNotification()
        this.props.setCurrentChannel(channel)
        this.setActiveChannel(channel)
        this.props.setPrivateChannel(false)
        this.setState({channel})
    }

    clearNotification = () =>{
        let index = this.state.notifications.findIndex(notification=>notification.id === this.state.channel.id)
        if(index !== -1){
            let updatedNotification = [...this.state.notifications]
            updatedNotification[index].total = this.state.notifications[index].lastKnownTotal
            updatedNotification[index].count = 0
            this.setState({notifications:updatedNotification})
        }
    }

    setActiveChannel=channel=>{
        this.setState({activeChannel:channel.id})
    }
    getNotificationCount = channel=>{
        let count=0
        this.state.notifications.forEach(notification =>{
            if(notification.id === channel.id){
                count = notification.count
            }
        })
        if(count>0){
            return count
        }
    }
    

    render(){

        const {channels , modal} = this.state;

        return(
            <React.Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" />CHANNELS
                        </span>
                        {" "}({channels.length})<Icon name="add" onClick={this.openModal}/>
                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
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
                    <Button color="green" inverted onClick={this.handleSubmit}>
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


export default connect(null,{setCurrentChannel,setPrivateChannel})(Channels);
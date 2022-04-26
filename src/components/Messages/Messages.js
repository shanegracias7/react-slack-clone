import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

class Messages extends React.Component {
    state={
        messagesRef:firebase.database().ref('messages'),
        channel:this.props.currentChannel,
        user:this.props.currentUser,
        messages:[],
        messagesLoading:true,
        numUniqueUsers:'',
        searchLoading:false,
        searchTerm:'',
        searchResult:[]
    }
    componentDidMount(){
        const {channel,user} = this.state;

        if(channel&&user){
            this.addListners(channel.id)
        }
    }
    addListners = channelId =>{
        this.addMessageListner(channelId)
    }
    addMessageListner = channelId =>{
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added',snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
            this.countUniqueUsers(loadedMessages);
        })
    }
    countUniqueUsers = message =>{
        const uniqueUsers = message.reduce((acc,message)=>{
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        },[])
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0
        const numUniqueUsers = `${uniqueUsers.length} user${plural?'s':''}`
        this.setState({numUniqueUsers})
    }

    displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));
    
    displayChannelName = channel => channel? `#${channel.name}` :''
    
    handleSearchChange = event =>{
        this.setState({
            searchTerm:event.target.value,
            searchLoading:true
        },
        ()=>this.handleSearchMessage())
    }

    handleSearchMessage = ()=>{
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm,'gi')
        const searchResult = channelMessages.reduce((acc,message)=>{
            if((message.content && message.content.match(regex))
                || message.user.name.match(regex))
            {
                acc.push(message);
            }
            return acc;
        }
        ,[])
        this.setState({searchResult})
    }



    render() {
        const { messagesRef,channel,user, messages,numUniqueUsers,searchResult,searchTerm} = this.state
        return (
        <React.Fragment>
            <MessagesHeader 
                channelName = {this.displayChannelName(channel)}
                numUniqueUsers={numUniqueUsers}
                handleSearchChange={this.handleSearchChange}
            />

            <Segment>
            <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResult) : this.displayMessages(messages)}
            </Comment.Group>
            </Segment>

            <MessageForm 
                messagesRef={messagesRef}
                currentChannel={channel}
                currentUser={user}   
            />
        </React.Fragment>
        );
    }
}
export default Messages;

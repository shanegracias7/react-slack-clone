import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setUserPosts } from "../../actions";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import Typing from "./Typing";
import Skeleton from "./Skeleton";

class Messages extends React.Component {
    state={
        isPrivateChannel:this.props.isPrivateChannel,
        privateMessagesRef:firebase.database().ref('privateMessages'),
        messagesRef:firebase.database().ref('messages'),
        userRef:firebase.database().ref('users'),
        typingRef: firebase.database().ref('typing'),
        connectedRef: firebase.database().ref('.info/connected'),
        channel:this.props.currentChannel,
        user:this.props.currentUser,
        messages:[],
        messagesLoading:true,
        numUniqueUsers:'',
        searchLoading:false,
        searchTerm:'',
        searchResult:[],
        isChannelStarred:false,
        typingUsers:[]
        
    }

    getMessagesRef =()=>{
        const {messagesRef,privateMessagesRef,isPrivateChannel} = this.state;
        return isPrivateChannel ? privateMessagesRef:messagesRef
    }

    componentDidMount(){
        const {channel,user} = this.state;

        if(channel&&user){
            this.addListners(channel.id)
            this.addUserStarsListner(channel.id,user.uid)
        }
    }
    componentDidUpdate(){
        if(this.messagesEnd){
            this.scrollToBottom()
        }
    }
    scrollToBottom= ()=>{
        this.messagesEnd.scrollIntoView({behavior:'smooth'})
    }
    addListners = channelId =>{
        this.addMessageListner(channelId)
        this.addTypingListner(channelId)
    }
    addUserStarsListner=(channelId,userId)=>{
        this.state.userRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data=>{
                if(data.val()!==null){
                    const ChannelIds = Object.keys(data.val())
                    const prevStarred = ChannelIds.includes(channelId)
                    this.setState({isChannelStarred:prevStarred})
                }
            })
    }

    addTypingListner = channelId=>{
        let typingUsers =[];
        this.state.typingRef    
            .child(channelId)
            .on('child_added',snap=>{
                if(this.state.user.uid !== snap.key){
                    typingUsers = typingUsers.concat({
                        id:snap.key,
                        name:snap.val()
                    }) 
                    this.setState({typingUsers})
                }
            })

            this.state.typingRef    
            .child(channelId)
            .on('child_removed',snap=>{
                const index = typingUsers.findIndex(user => user.id === snap.key)
                if(index !== -1){
                    typingUsers = typingUsers.filter(user=>
                        user.id !== snap.key
                    ) 
                    this.setState({typingUsers})
                }
            })

            this.state.connectedRef.on('value',snap=>{
                if(snap.val()===true){
                    this.state.typingRef
                        .child(channelId)
                        .child(this.state.user.uid)
                        .onDisconnect()
                        .remove(err=>{
                            if(err!=null){
                                console.error(err)
                            }
                        })

                }
            })
    }

    addMessageListner = channelId =>{
        let loadedMessages = [];
        const ref = this.getMessagesRef()
        ref.child(channelId).on('child_added',snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedMessages);
            this.countUserPost(loadedMessages)
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
    countUserPost = messages =>{
        let userPosts = messages.reduce((acc,message)=>{
            if(message.user.name in acc){
                acc[message.user.name].count++;
            }
            else{
                acc[message.user.name] = {
                    avatar:message.user.avatar,
                    count:1
                }
            }
            return acc;
        },{})
        this.props.setUserPosts(userPosts);
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
    
    displayChannelName = channel => {
        return channel? `${this.state.isPrivateChannel ? '@':'#'}${channel.name}` :''
    }
    
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
        setTimeout(()=>this.setState({searchLoading:false}),500)
    }

    handleStar =()=>{
        this.setState(prevState =>({
            isChannelStarred:!prevState.isChannelStarred
        }),()=>this.starChannel())
    }

    starChannel =()=>{
        if(this.state.isChannelStarred){
            this.state.userRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]:{
                        name:this.state.channel.name,
                        details:this.state.channel.details,
                        createdBy:{
                            name:this.state.channel.createdBy.name,
                            avatar:this.state.channel.createdBy.avatar
                        }
                    }
                })
        }
        else{
            this.state.userRef
                .child(`${this.state.user.uid}/starred`)
                .remove(err=>{
                    if(err!==null){
                        console.error(err)
                    }
                })
        }
    }
    displayTypingUsers = users=>(
        users.length>0 && users.map(user=>(
            <div style={{ display: "flex", alignItems: "center", marginBottom:'0.2em' }} key={user.id}>
              <span className="user__typing">{user.name} is typing</span> <Typing />
            </div>
        ))
    )
    displayMessagesLoading = loading =>(
        loading?
        <React.Fragment>
            {[...Array(10)].map((_,i)=>(<Skeleton key={i}/>))}
        </React.Fragment>:
        null
    )

    render() {
        const { messagesRef,channel,user, messages,numUniqueUsers,searchResult,searchTerm,searchLoading,isPrivateChannel,isChannelStarred,typingUsers,messagesLoading} = this.state
        return (
        <React.Fragment>
            <MessagesHeader 
                channelName = {this.displayChannelName(channel)}
                numUniqueUsers={numUniqueUsers}
                handleSearchChange={this.handleSearchChange}
                searchLoading={searchLoading}
                isPrivateChannel={isPrivateChannel}
                isChannelStarred={isChannelStarred}
                handleStar={this.handleStar}
            />

            <Segment>
                <Comment.Group className="messages">
                    {this.displayMessagesLoading(messagesLoading)}
                    {searchTerm ? this.displayMessages(searchResult) : this.displayMessages(messages)}
                    {this.displayTypingUsers(typingUsers)}
                    <div ref={node =>(this.messagesEnd = node)}></div>
                </Comment.Group>
            </Segment>

            <MessageForm 
                messagesRef={messagesRef}
                currentChannel={channel}
                currentUser={user}
                isPrivateChannel={isPrivateChannel}
                getMessagesRef={this.getMessagesRef}   
            />
        </React.Fragment>
        );
    }
}
export default connect(null,{setUserPosts})(Messages);

import React from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import uuidv4 from "uuid/v4";
import firebase from "../../firebase";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";
import {emojiIndex , Pcker, Picker} from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
class MessageForm extends React.Component {
    state = {
        message:'',
        channel:this.props.currentChannel,
        user:this.props.currentUser,
        loading:false,
        errors:[],
        modal:false,
        uploadTask:null,
        uploadState:'',
        typingRef:firebase.database().ref('typing'),
        storageRef: firebase.storage().ref(),
        percentUploaded:0,
        emojiPicker:false
    }
    handleChange =event=>{
        this.setState({[event.target.name]:event.target.value});  
    }
    createMessage=(fileURl=null)=>{
        const message={
            timestamp:firebase.database.ServerValue.TIMESTAMP,
            user:{
                id:this.state.user.uid,
                name:this.state.user.displayName,
                avatar:this.state.user.photoURL
            }
        };
        if(fileURl!==null){
            message['image']=fileURl
        }
        else{
            message['content']=this.state.message
        }
        return message;
    }
    getPath =()=>{
        if(this.props.isPrivateChannel){
            return `chat/private-${this.state.channel.id}`
        }
        else{
            return 'chat/public'
        }
        
    }
    uploadFile = (file,metadata)=>{
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        console.log(uuidv4())
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

        this.setState({
            uploadState:'uploading',
            uploadTask:this.state.storageRef.child(filePath).put(file,metadata)
        },
        ()=>{
            this.state.uploadTask.on('state_changed',snap=>{
                const percentUploaded =Math.round((snap.bytesTransferred/snap.totalBytes)*100) 
                this.setState({percentUploaded:percentUploaded})
            },
            err =>{
                console.error(err)
                this.setState({
                    errors:this.state.errors.concat(err),
                    uploadState:'error',
                    uploadTask:null
                })
            },
            ()=>{
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
                    this.sendFileMessage(downloadURL,ref,pathToUpload)
                })
                .catch(err=>{
                    console.error(err)
                    this.setState({
                        errors:this.state.errors.concat(err),
                        uploadState:'error',
                        uploadTask:null
                    })
                })
            }
            )
        }
        )
    }

    sendFileMessage = (fileUrl,ref,pathToUpload)=>{
        ref.child(pathToUpload)
           .push()
           .set(this.createMessage(fileUrl))
           .then(()=>{
               this.setState({uploadState:'done'})
           })
           .catch(err=>{
            console.error(err)
            this.setState({
                errors:this.state.errors.concat(err)
            })
           })

    }
    sendMessage=()=>{
        const {getMessagesRef} = this.props;
        const {message,channel,typingRef,user} = this.state;

        if (message) {
            this.setState({ loading: true });
            getMessagesRef()
              .child(channel.id)
              .push()
              .set(this.createMessage())
              .then(() => {
                this.setState({ loading: false, message: "", errors: [] });
                typingRef
                    .child(channel.id)
                    .child(user.uid)
                    .remove()
              })
              .catch(err => {
                console.error(err);
                this.setState({
                  loading: false,
                  errors: this.state.errors.concat(err)
                });
              });
        }
        else{
            this.setState({
                errors: this.state.errors.concat({ message: "Add a message" })
              });
        }
    }
    handleKeyDown = ()=>{
        const {message,typingRef,channel,user} = this.state
        if(message){
            typingRef
                .child(channel.id)
                .child(user.uid)
                .set(user.displayName)
        }
        else{
            typingRef
                .child(channel.id)
                .child(user.uid)
                .remove()
        }
    }
    
    handleTogglePicker = ()=>{
        this.setState({emojiPicker:!this.state.emojiPicker})
    }
    openModal =()=>{this.setState({modal:true})}
    closeModal =()=>{this.setState({modal:false})}

    render() {

        const {errors,message,loading,modal,uploadState,percentUploaded,emojiPicker}=this.state
        return (
        <Segment className="message__form">
            {emojiPicker&&(
                <Picker
                    set="apple"
                    className="emojipicker"
                    title="Pick your emoji"
                    emoji="point_up"
                />
            )}
            <Input
            fluid
            name="message"
            value={message}
            disabled={loading}
            style={{ marginBottom: "0.7em" }}
            label={<Button icon={"add"} onClick={this.handleTogglePicker} /> }
            labelPosition="left"
            placeholder="Write your message"
            onChange={this.handleChange}
            onKeyDown ={this.handleKeyDown}
            className={
                errors.some(error => error.message.includes("message"))
                  ? "error"
                  : ""
              }
            />
            <Button.Group icon widths="2">
            <Button
                color="orange"
                content="Add Reply"
                labelPosition="left"
                icon="edit"
                onClick={this.sendMessage}
            />
            <Button
                color="teal"
                content="Upload Media"
                labelPosition="right"
                icon="cloud upload"
                onClick={this.openModal}
                disabled={uploadState==="uploading"}
            />
            
            </Button.Group>
            <FileModal
                modal={modal}
                closeModal={this.closeModal}
                uploadFile={this.uploadFile}
            />
            <ProgressBar
                uploadState={uploadState}
                percentUploaded={percentUploaded}
            />  
        </Segment>
        );
    }
}

export default MessageForm;
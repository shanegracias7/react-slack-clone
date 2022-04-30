import React from "react";
import {Segment,Header,Icon,Input} from 'semantic-ui-react';

class MessagesHeader extends React.Component{
    render(){
        const {channelName,numUniqueUsers,handleSearchChange,searchLoading,isPrivateChannel} = this.props;
        return (
            <Segment clearing>
                {/*channel title*/}
                <Header floated="left"  as="h2" fluid="true" style={{marginBottom:0}}>
                    <span>
                        {channelName}
                        {!isPrivateChannel && <Icon name={"star outline"} color="black"/>}
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>
                

                {/*channel search input*/}
                <Header floated="right">
                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="search messages"
                    />
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader;
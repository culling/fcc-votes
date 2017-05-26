$('document').ready(function() {
    console.log("polls.js loaded");
    
});


class TestComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: '' };
    }

    componentDidMount() {
        // grab state from the server
        $.ajax({ url: '/api/message' })
            .then(function(data) {
            this.setState(data);
            }.bind(this))
        // listen for state changes on the socket
        socket.on('new state', function(newState) {
            this.setState(newState);
        }.bind(this));
    }

/*
  _handleChangeMessage(e) {
    this.setState({ message: e.target.value });
    console.log(this.state.message);
  }
*/

  _handleChangeMessage(e) {
    this.networkSetState({ message: e.target.value });
    console.log(this.state.message);
  }
  
    networkSetState(newStateDiff) {
        // do some awesome network things here
        // 1. put the entire state into the database
        this.saveStateToDB();
        // 2. put diffs onto the websocket
        this.postToSocket(newStateDiff);
        // 3. set state as per usual
        this.setState(newStateDiff);
    }


    postToSocket(newStateDiff) {
        socket.emit('new state', newStateDiff);
    }

    saveStateToDB() {
        $.ajax({ url: '/api/message', type: 'PUT', data: this.state });
    }


    render() {
        return (
        <div><h1> React is Go! </h1> 
            <input type="text" value={this.state.message} onChange={this._handleChangeMessage.bind(this)} />
        </div>
    )}


};

/*
class TestComponent extends React.Component {
    render(){
        return (
        <div><h1> React is Go! </h1> </div>
        );
    }
}
*/

class PollsContainerComponent extends React.Component{
    constructor(){
        super();
        this.state={
            polls: []
        }
    }

    componentWillMount(){
        console.log(this.state.polls)
        jQuery.ajax({
            method: 'GET',
            url:"/api/polls",
            success: (polls)=>{
                this.setState({ polls: polls })
            }
        });

        //this._polls();
        console.log(this.state.polls);
    }

    _handleChangeMessage() {
        this.setState({ polls: this.state.polls });
        console.log(this.state.message);
    }



    componentWillUpdate(){
        console.log(this.state.polls);        
    }

    render(){
        return( 
            <div id="polls-container" className="polls-container">
                <p>Polls Container</p>
                    { this.state.polls.map( (pollObject, i) => 
                    <PollsComponent key={i} poll={pollObject} voteAction={this._handleChangeMessage.bind(this) }/> ) }
            </div>
        );
    }
}

class PollsComponent extends React.Component{
    _voteNow (responseOption, username){
        console.log("Vote now Clicked");
        console.log("Response Option: ");
        console.log( responseOption.responseOption);
        console.log("Username: " )
        console.log(username);

        console.log("Poll: " )
        console.log(this.props.poll);

        var poll = Object.assign(this.props.poll); 
        
        poll.votes = poll.votes.filter(function(vote){
            return vote.username != username
        });
        
        poll.votes.push({username:username, voteChoice: responseOption.responseOption});
        this.setState({poll: poll});

        console.log(this.props.poll)
        jQuery.ajax({
            type: 'POST',  
            dataType: 'json',
            url:"/api/polls/update",
            data: JSON.stringify({ poll })
        });
    }



    render(){
        return (
        <div className="poll" > 
            <h3> {this.props.poll.question} </h3>
            <div>Question ID: {this.props.poll.id} </div>
            <div>Meeting: {this.props.poll.meeting} </div>
            <div>Poll Created On: {this.props.poll.date} </div>
 

            <div>
                <h4> Response Options</h4>
                <ul>
                    {/*<div> {this.props.poll.responseOptions.map( (responseOption, i)=> <li key={i} >{responseOption}</li> )} </div> */}
                    <div> {this.props.poll.responseOptions.map( (responseOption, i)=> <ResponseOptionComponent key={i} 
                    responseOption={responseOption}
                    onClick = { ()=> this._voteNow({responseOption}, "user.username")}
                    poll={this.props.poll} /> )} </div>

                </ul>
             </div>

             <div>
                 <h4> Votes </h4>
                    {this.props.poll.votes.length > 0 && 
                    <ul> {this.props.poll.votes.map( (vote ) => 
                        <li key={this.props.poll.id + vote.username + " "+ vote.voteChoice }>
                            {vote.username} : {vote.voteChoice} 
                        </li>) }
                    </ul>}
                    {this.props.poll.votes.length == 0 && 
                        <b> No votes taken yet </b>
                    }
             </div>

            { (this.props.poll.votingOpen == true) && 
                <div>
                     <button type="button" className="btn btn-primary" onClick={this._voteNow.bind(this)}> Vote Now </button>
                </div>
            }
            <br />
        </div>

        )
    }


}


class ResponseOptionComponent extends React.Component{
render(){
    return(
        <div className="responseOption">

            { (this.props.poll.votingOpen == true) && 
                     <button type="button" className="btn btn-primary" onClick={this.props.onClick } > {this.props.responseOption} </button>
            }
        </div>
    )
}

}

ReactDOM.render (
    <PollsContainerComponent />, document.getElementById('mount-point')
)


ReactDOM.render (
    <TestComponent />, document.getElementById('test-point')
)

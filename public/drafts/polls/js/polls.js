$('document').ready(function() {
    console.log("polls.js loaded");
});

/*
function showPolls(){
    var pollsURL = "/api/polls";
    console.log(pollsURL);
    $.getJSON(pollsURL, function(returnValue){
        //console.log(returnValue);
    });
};
*/

class TestComponent extends React.Component {
    render(){
        return (
        <div> React is Go! </div>
        );
    }
}

class PollsContainerComponent extends React.Component{
    constructor(){
        super();
        this.state={
            polls: []
        }
    }

    componentWillMount(){
        this._polls();
        console.log(this.state);
    }


    _polls(event){
        console.log(this.state.polls)
        jQuery.ajax({
            method: 'GET',
            url:"/api/polls",
            success: (polls)=>{
                this.setState({ polls })
            }
        });
    }


    render(){
        return( 
            <div id="polls-container" className="polls-container">
                <p>Polls Container</p>

                    { this.state.polls.map( pollObject => <PollsComponent key={pollObject.id} poll={pollObject} /> ) }

            </div>
        );
    }
}

class PollsComponent extends React.Component{


    render(){
        return (
        <div key={this.props.poll.id } className="poll" > 
            <div> {this.props.poll.id} </div>
            <div> {this.props.poll.meeting} </div>
            <div> {this.props.poll.date} </div>
            <div> {this.props.poll.question} </div> 

            <ul>
                <div> {this.props.poll.responseOptions.map( responseOption => <li key={this.props.poll.id +" "+responseOption } >{responseOption}</li> )} </div>
            </ul>

            <ul> {this.props.poll.votes.map( (vote ) => 
                <li key={this.props.poll.id + vote.username + " "+ vote.voteChoice }>
                    {vote.username} : {vote.voteChoice} 
                </li>) }
            </ul>

            <div> {this.props.poll.votingOpen} </div>
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

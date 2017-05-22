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

    componentWillUpdate(){
        console.log(this.state.polls);        
    }

    render(){
        return( 
            <div id="polls-container" className="polls-container">
                <p>Polls Container</p>

                    { this.state.polls.map( (pollObject, i) => <PollsComponent key={i} poll={pollObject} /> ) }

            </div>
        );
    }
}

class PollsComponent extends React.Component{
    _voteNow (){
        console.log("Vote now Clicked");
    }

    render(){
        return (
        <div key={this.props.poll.id } className="poll" > 
            <h3> {this.props.poll.question} </h3>
            <div>Question ID: {this.props.poll.id} </div>
            <div>Meeting: {this.props.poll.meeting} </div>
            <div>Poll Created On: {this.props.poll.date} </div>
 

            <div>
                <h4> Response Options</h4>
                <ul>
                    <div> {this.props.poll.responseOptions.map( (responseOption, i)=> <li key={i} >{responseOption}</li> )} </div>
                </ul>
             </div>

             <div>
                 <h4> Votes </h4>
                    {this.props.poll.votes.count > 0 && 
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

ReactDOM.render (
    <PollsContainerComponent />, document.getElementById('mount-point')
)


ReactDOM.render (
    <TestComponent />, document.getElementById('test-point')
)

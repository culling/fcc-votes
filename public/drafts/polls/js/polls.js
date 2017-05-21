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


    render(){
        return (
        <div key={this.props.poll.id } className="poll" > 
            <h3> {this.props.poll.question} </h3>
            <div> {this.props.poll.id} </div>
            <div> {this.props.poll.meeting} </div>
            <div> {this.props.poll.date} </div>
 

{/*
             <ul>
                 <div> {this.props.poll.responseOptions.map( (responseOption, i)=> <li key={i} >{responseOption}</li> )} </div>
             </ul>
 
             <ul> {this.props.poll.votes.map( (vote ) => 
                 <li key={this.props.poll.id + vote.username + " "+ vote.voteChoice }>
                     {vote.username} : {vote.voteChoice} 
                 </li>) }
             </ul>
*/}
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

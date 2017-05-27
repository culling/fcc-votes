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

        jQuery.ajax({
            method: 'GET',
            url:"/api/user",
            success: (user)=>{
                this.setState({ user: user })
            }
        });
        console.log(this.state.user);

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
                    <PollsComponent key={i} poll={pollObject} user={this.state.user} voteAction={this._handleChangeMessage.bind(this) }/> ) }
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
                    onClick = { ()=> this._voteNow({responseOption}, this.props.user.username )}
                    poll={this.props.poll} /> )} </div>

                </ul>
             </div>

             <div>
                 <h4> Votes </h4>
                    {this.props.poll.votes.length > 0 && 
                    <div>
                    <ul> {this.props.poll.votes.map( (vote ) => 
                        <li key={this.props.poll.id + vote.username + " "+ vote.voteChoice }>
                            {vote.username} : {vote.voteChoice} 
                        </li>) }
                    </ul>


                    <VoteGraph poll={this.props.poll} />

                    </div>
                    }
                    {this.props.poll.votes.length == 0 && 
                        <b> No votes taken yet </b>
                    }
             </div>

            { (this.props.poll.votingOpen == true) && 
                <div>
                     {/* <button type="button" className="btn btn-primary" onClick={this._voteNow.bind(this)}> Vote Now </button> */}
                </div>
            }
            <br />
        </div>

        )
    }


}


class VoteGraph extends React.Component{
    //http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart
    constructor(){
        super();
    }

    componentDidMount(){
        this._makeGraph();
    }

    _makeGraph(){
        let h = 400;
        let w = 400;
        let r = 100;
        let barPaddingWidth = 0;
        let yPadding = 30;
        let xPadding = 80;
        //console.log(this.props.poll);

        let graphId = "#vote-graph-" + this.props.poll.id;
        console.log(graphId);

        let votesTotalsObject =  d3.nest()
            .key(function(d) { return d.voteChoice; })
            .rollup(function(v) { return v.length; })
            .entries(this.props.poll.votes);
        let votesTotals = votesTotalsObject;

        console.log( votesTotals );
        var color = d3.scaleOrdinal(d3.schemeCategory20c); 

        let svg = d3.select(graphId)
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")");
            
        var pie = d3.pie()                              //this will create arc data for us given a list of values
            .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

        var arc = d3.arc()              //this will create <path> elements for us using arc data
            .innerRadius(0)
            .outerRadius(r);

        var path = svg.selectAll("path")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie(votesTotals) )                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("path")
            .attr("d", arc)                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
            .attr("fill", function(d, i) { return color(i); } ); //set the color for each slice to be chosen from the color function defined above

        path.append("text")                                      //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                console.log(d);
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return votesTotals[i].key; });        //get the label from our original data array
    }



    render(){
        return(
            <div id={"vote-graph-" + this.props.poll.id} className="vote-graph">
                <p>Graph Div</p>
                {"vote-graph-" + this.props.poll.id}
            </div>
        );
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

/*
ReactDOM.render (
    <TestComponent />, document.getElementById('test-point')
)
*/
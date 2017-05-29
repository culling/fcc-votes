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
            url:"/api/polls/user",
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
                    <PollsComponent key={i} 
                        poll={pollObject} 
                        user={this.state.user} 
                        /*voteAction={this._handleChangeMessage.bind(this)}*/

                         /> ) }
            </div>
        );
    }
}

class PollsComponent extends React.Component{
    _voteNow (responseOption, username){
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

    _newResponseOption(){
        let poll     = Object.assign( this.props.poll);
        poll.responseOptions.push(this.newResponseOption.value);
        console.log("new Response Option: " + this.newResponseOption.value);
        console.log(poll);

        jQuery.ajax({
            type: 'POST',  
            dataType: 'json',
            url:"/api/polls/update",
            data: JSON.stringify({ poll }),
            success:(
                    this.newResponseOption.value = ""
            )
        });

        this.forceUpdate();
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
                    <div> {this.props.poll.responseOptions.map( (responseOption, i)=> 
                        <ResponseOptionComponent key={i} 
                        responseOption={responseOption}
                        onClick = { ()=> this._voteNow({responseOption}, this.props.user.username )}
                        poll={this.props.poll} /> )} 
                    </div>

                        <label className="col-sm-2">New Response Option</label>
                        <div className="col-sm-10">                        
                            <input type="text" name="newResponseOption" className="form-control" defaultValue={""}
                             ref={(input)=> this.newResponseOption = input} 
                            ></input>
                            <button className="btn btn-secondary" onClick={this._newResponseOption.bind(this)}>Save</button>

                        </div>


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
                        <VoteGraph poll={this.props.poll}  />

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
    //https://bl.ocks.org/santi698/f3685ca8a1a7f5be1967f39f367437c0
    constructor(props){
        super(props);

    }

    componentDidMount(){
        let w = 400;
        let r = 100;
        let barPaddingWidth = 0;
        let yPadding = 30;
        let xPadding = 80;
        let h = (r *2)+ yPadding;

        let graphId = "#vote-graph-" + this.props.poll.id;
        
        var svg = d3.select(graphId)
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")");

        this.svg = svg;
        //console.log(svg);
        this._makeGraph(svg);
        
    }

    componentWillUpdate(){
        this.svg.selectAll(".arc").remove();
        this.svg.selectAll('.legend').remove();
        this._makeGraph(this.svg);

    }

    _makeGraph(svg){
        var votesTotals =  d3.nest()
            .key(function(d) { return d.voteChoice; })
            .rollup(function(v) { return v.length; })
            .entries(this.props.poll.votes);
        

        let w = 400;
        let r = 100;
        let barPaddingWidth = 0;
        let yPadding = 30;
        let xPadding = 80;
        let h = (r *2)+ yPadding;

        var legendRectSize  = 18;
        var legendSpacing   = 4;   
        //console.log(this.props.poll);

//        console.log(graphId);
/*
        var votesTotals =  d3.nest()
            .key(function(d) { return d.voteChoice; })
            .rollup(function(v) { return v.length; })
            .entries(this.props.poll.votes);
        //let votesTotals = votesTotalsObject;
*/
        //console.log( votesTotals );
        var color = d3.scaleOrdinal(d3.schemeCategory20c); 

    

        var pie = d3.pie()                              //this will create arc data for us given a list of values
            .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

        var arc = d3.arc()              //this will create <path> elements for us using arc data
            .innerRadius( (r/Math.PI) *2 )
            .outerRadius(r);

        var labelArc = d3.arc()
            .innerRadius(r - 40)
            .outerRadius(r - 40);

        var g = svg.selectAll(".arc")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie(votesTotals) )                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter()
            .append("g")
            .attr("class", "arc");
            
        g.append("path")
            .attr("d", arc)                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
            .attr("fill", function(d, i) { return color(i); } ); //set the color for each slice to be chosen from the color function defined above

       /*     
        g.append("text")
            .attr("transform", function(d) {
                //console.log(d.data.key);
                return "translate(" + labelArc.centroid(d) + ")"; })
            .attr("class", "graph-text")
            .text(function(d) { 
                console.log(d.data.key);
                return d.data.key; });
        */

        var legend = svg.selectAll('.legend')
          .data(color.domain())
          .enter()
          .append('g')
          .attr('class', 'legend')
          .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = w * (1/3);
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
          });
        legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color)
          .style('stroke', color);
        legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d) { 
              //console.log( votesTotals[d].key )
              return votesTotals[d].key }); 




    }



    render(){

        return(
            <div id={"vote-graph-" + this.props.poll.id} className="vote-graph">

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
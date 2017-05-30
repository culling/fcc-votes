$('document').ready(function() {
    console.log("polls.js loaded");
    
});

class PollsContainerComponent extends React.Component{
    constructor(){
        super();
        this.state={
            polls: [],
            detailsState: "details-div-hidden"

        }
    }

    componentWillMount(){
        var search = location.search.substring(1);
        if (search != ""){
            var searchObject = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
            console.log(searchObject);
            searchObject
        }else{
            searchObject = {};
        }

        jQuery.ajax({
            method: 'GET',
            url:"/api/user",
            success: (user)=>{
                this.setState({ user: user })



                if (searchObject.id){
                    jQuery.ajax({
                        method: 'GET',
                        url:("/api/polls/"+ searchObject.id),
                        success: (polls)=>{
                            //console.log(polls);
                            this.setState({detailsState: "details-div-visible"});
                            this.setState({polls: polls });
                            //console.log(this.state);
                        }
                    });
                }else{

                    if (searchObject.user){
                        jQuery.ajax({
                            method: 'GET',
                            url:"/api/polls/user",
                            success: (polls)=>{
                                if (! user._id){
                                    window.location = "/";
                                } 
                                console.log(polls);
                                this.setState({detailsState: "details-div-hidden"});
                                this.setState({ polls: polls })
                            }
                        });
                    }else{
                        jQuery.ajax({
                            method: 'GET',
                            url:"/api/polls",
                            success: (polls)=>{
                                console.log(polls);
                                this.setState({ polls: polls })
                            }
                        });
                    }

                }





            }
        });

    }

    _handleChangeMessage() {
        this.setState({ polls: this.state.polls });

    }


    render(){
        return( 
            <div id="polls-container" className="polls-container">
                    { this.state.polls.map( (pollObject, i) => 
                    <PollsComponent key={i} 
                        poll={pollObject} 
                        user={this.state.user}
                        detailsState={this.state.detailsState }

                         /> ) }
                {(this.state.polls.length == 0) &&
                    <div>
                        No Polls Found!
                    </div>
                }
            </div>
        );
    }
}

class PollsComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = ({
            detailsState: ""
        });
    }

    componentWillMount(){        
        this.setState({detailsState: this.props.detailsState});
    }

    _voteNow (responseOption, username){
        var poll = Object.assign(this.props.poll); 
        
        poll.votes = poll.votes.filter(function(vote){
            return vote.username != username
        });
        
        poll.votes.push({username:username, voteChoice: responseOption.responseOption});
        this.setState({poll: poll});

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

    _deletePoll(){
        let poll     = Object.assign( this.props.poll);
        jQuery.ajax({
            type: 'DELETE',
            dataType: 'json',
            url:("/api/polls/delete/" + this.props.poll.id),
            data: JSON.stringify({ poll }),
            success:(
                window.location="/"
            )
        });

        
    }

    _showDetailsPane(){
        let detailsState = ((this.state.detailsState === "details-div-visible" )? "details-div-hidden": "details-div-visible");
        this.setState({detailsState: detailsState });
        //this.forceUpdate();
    }


    render(){
        return (
        <div className="poll" >
            <div className="row">
                <div className="col-md-12">  
                    {/*Header Button*/}
                    <button className="vote-question btn btn-block" onClick={this._showDetailsPane.bind(this)}> 
                        {this.props.poll.meeting != "No Meeting" &&
                         this.props.poll.meeting +" - "+ this.props.poll.question} 

                        {this.props.poll.meeting == "No Meeting" &&
                        this.props.poll.question} 
                    </button>

                    {/*Details Pane*/}
                    <div className={this.state.detailsState}>
                        <div>Question ID: {this.props.poll.id} </div>
                        <div>Meeting: {this.props.poll.meeting} </div>
                        <div>Poll Created On: {this.props.poll.date} </div>
                        <div>Poll Created By: {this.props.poll.createdByUser} </div>
                        {(this.props.user.username == this.props.poll.createdByUser) &&
                            <button className="btn btn-danger" onClick={this._deletePoll.bind(this)}> DELETE THE POLL </button>
                        }
                    </div>
                </div>
            </div>
            <br />


            {/*Interactive section*/}
            <div className={"row "+ this.state.detailsState}>

                {/* Vote Options */}
                <div className="col-md-4">
                    <h4> Response Options</h4>
                    <ul>
                        <div> {this.props.poll.responseOptions.map( (responseOption, i)=> 
                            <ResponseOptionComponent key={i} 
                            responseOption={responseOption}
                            onClick = { ()=> this._voteNow({responseOption}, this.props.user.username )}
                            poll={this.props.poll} /> )} 
                        </div>


                        {/*New Response Option*/}
                        {this.props.user._id &&
                        <div>
                            {/*<label className="new-response">New Response Option</label>*/}
                            <div className="input-group">                        
                                <input type="text" name="newResponseOption" className="form-control" defaultValue="" placeholder="New Response Option" 
                                ref={(input)=> this.newResponseOption = input} 
                                ></input>
                                <span className="input-group-btn">
                                    <button className="btn btn-block btn-primary" onClick={this._newResponseOption.bind(this)}>Save</button>
                                </span>
                            </div>
                        </div>
                        }


                    </ul>
                </div>


                {/* Votes History */}
                {(this.props.poll.votes.length > 0 && this.props.user._id ) && 
 
                <div className="col-md-4">
                    <h4> Votes </h4>

                    <ul> {d3.nest()
                        .key(function(d) { return d.voteChoice; })
                        .rollup(function(v) { return v.length; })
                        .entries(this.props.poll.votes).map( (voteTotal, i ) => 
                        <li key={i }>
                            {voteTotal.key} : {voteTotal.value} 
                        </li>) }
                    </ul>

                </div>
                }

                {/* Graph */}
                {this.props.poll.votes.length > 0 && 
                <div className="col-md-4">
                    <h4> Graph </h4>
                    <VoteGraph poll={this.props.poll}  />
                </div>
                }

                {/* Warning for No Votes */}
                {this.props.poll.votes.length == 0 && 
                    <b> No votes taken yet </b>
                }

                <br />
            </div>


            {/*Share It*/}
            {this.props.user._id && 
            <div className={"button-bar "+ this.state.detailsState}>
                 <a href={"https://twitter.com/intent/tweet?url=" + 
                    "http://" + window.location.hostname +
                    "/?id="+this.props.poll.id + 
                    "&amp;text=" + this.props.poll.question + 
                    "%20%7C%20fcc-voting"} className="btn btn-block">
                    
                    <i className="fa fa-twitter"></i> 
                    Share on Twitter
                 </a>
            </div>
            }

        </div>
        )
    }


}



class ResponseOptionComponent extends React.Component{
    render(){
        return(
            <div className="responseOption">

                { (this.props.poll.votingOpen == true) && 
                        <button type="button" className="btn btn-block btn-primary response-option" onClick={this.props.onClick } > {this.props.responseOption} </button>
                }
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
        

        let w = 350;
        let r = 100;
        let barPaddingWidth = 0;
        let yPadding = 30;
        let xPadding = 80;
        let h = (r *2)+ yPadding;

        var legendRectSize  = 18;
        var legendSpacing   = 4;   
        //console.log(this.props.poll);

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


ReactDOM.render (
    <PollsContainerComponent />, document.getElementById('mount-point')
)

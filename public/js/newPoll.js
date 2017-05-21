$('document').ready(function() {
    console.log("polls.js loaded");
});
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
            polls: [],
            newPoll: {
                meeting : "none",
                question: "",
                responseOptions:    []
            }
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

    _editMeeting(){
        let newPoll     = Object.assign( this.state.newPoll);
        newPoll.meeting = this.meeting.value;
        console.log("edit Meeting: " + newPoll.meeting);
        this.setState({newPoll:newPoll});
    }

    _editPollQuestion(){
        let newPoll     = Object.assign( this.state.newPoll);
        newPoll.question = this.pollQuestion.value;
        console.log("edit Poll Question: " + newPoll.question);
        this.setState({newPoll:newPoll});

    }

    _addResponseOption(){ 
        let newPoll = Object.assign( this.state.newPoll);
        console.log('New Response Option Clicked')
        let newResponseOption = this.newResponseOption.value;
        console.log("new Response Option: "+ newResponseOption);
        newPoll.responseOptions.push(newResponseOption);
        this.newResponseOption.value = "";
        //this.forceUpdate();
        this.setState({newPoll: newPoll})
    }

    _removeResponseOption(i){
        let newPoll = Object.assign(this.state.newPoll);
        newPoll.responseOptions.splice(i,1);
        {console.log(newPoll)}
        this.setState({newPoll: newPoll});
        //this.forceUpdate();
    }




    _addMeetingOption(){ 
        console.log('New Meeting Option Clicked')
    }

    _submitPoll(){
        console.log("Submit Poll Clicked");
        console.log(this.state.newPoll);
        let newPoll = this.state.newPoll;
        //newPoll.question = 
        //localStorage.setItem("recipes", (JSON.stringify(this.state.recipes) )   );    
        jQuery.ajax({
            method: 'POST',
            url:"/api/polls/new",
            data: this.state.newPoll,
            success: function(){
                window.location= "/drafts/polls";
            },
            datatype: "string"
        });
   
    }

    render(){
        return( 
            <div id="polls-container" className="polls-container">
                <p>Polls Container</p>
                
                <form action="/api/polls/new" method="post">
                    <div className="form-group row">
                        <label className="col-sm-2">Meeting</label>
                        <div className="col-sm-10">
                            <div className="input-group">

                                <select name="meeting" className="form-control" onChange={this._editMeeting.bind(this)} 
                                ref={(input)=> this.meeting = input} 
                                >
                                        <option value="none">No Meeting</option>
                                        <option value="Fuits of the World">Fruits of the World</option>
                                        <option value="Vegetables of the World">Vegetables of the World</option>
                                </select>
                                <span className="input-group-btn">
                                    <button type="button" className="btn btn-info" onClick={this._addMeetingOption} >+</button>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-group row">
                        <label className="col-sm-2">Poll Question</label>
                        <div className="col-sm-10">
                            <input type="text" name="pollQuestion" className="form-control" defaultValue={this.state.newPoll.question } onChange={this._editPollQuestion.bind(this)}
                            ref={(input)=> this.pollQuestion = input} 
                            ></input>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2">Response Options</label>
                        <div className="col-sm-10">
                                <ul>
                                    {this.state.newPoll.responseOptions.map((responseOption, i) =>  
                                    <ResponseOption key={i} responseOption={responseOption} onClick={() => this._removeResponseOption(i) } />
                                        ) }
                                </ul>
                                <div className="input-group">
                                     <input type="text"     className="form-control" ref={(input) => this.newResponseOption = input }></input>
                                    <button type="button"   className="btn btn-info" onClick={this._addResponseOption.bind(this)}>+</button>
                                </div>

                        </div>
                    </div>




                    <button type="button"  className="btn btn-primary" onClick={this._submitPoll.bind(this)} >Create Poll</button>
                    
                </form>


            </div>
        );
    }
}

class ResponseOption extends React.Component{
    render(){
        return (
            <div className="row input-group">
                
                <input type="text" disabled="disabled" className="form-control" value={this.props.responseOption} ></input>
                    <span className="input-group-btn">
                        <button type="button" onClick={this.props.onClick} className="btn btn-info">-</button> 
                    </span>
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

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
            pollName: "New Poll",
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

    _addResponseOption(){ 
        console.log('New Response Option Clicked')
    }

    _addMeetingOption(){ 
        console.log('New Meeting Option Clicked')
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

                                <select name="meeting" className="form-control">
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
                            <input type="text" name="question" className="form-control"></input>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-2">Response Options</label>
                        <div className="col-sm-10">
                                <ul>
                                    {this.state.newPoll.responseOptions.map((responseOption, i) =>  
                                    <li key={i} responseOption={responseOption} ></li>
                                        ) }
                                </ul>
                                <div> 
                                     <input type="text" ref={(input) => this.newResponseOption = input }></input>
                                    <button type="button" onClick={this._addResponseOption.bind(this)}>Add Response Option</button>
                                </div>

                        </div>
                    </div>




                    <button type="submit" className="btn btn-primary" >Create Poll</button>
                    
                </form>


            </div>
        );
    }
}


ReactDOM.render (
    <PollsContainerComponent />, document.getElementById('mount-point')
)


ReactDOM.render (
    <TestComponent />, document.getElementById('test-point')
)

import React from 'react';
import PropTypes from 'prop-types';
function trimIt(toTrim){
    let result = toTrim;
    if (toTrim.length > 2) toTrim = toTrim.substring(1,3);
    if (toTrim.length != 2) return result;
    let zero = (toTrim.substring(0,1) == '0');
    if (zero){
        result = toTrim.substring(1,2);
    } 
    return result;
}
function getEnd(toTrim){
    let result = toTrim;
    if (toTrim.length > 4) result = toTrim.substring(4,toTrim.length);
    return result;
}
class InputGradeLevelControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           formErrors: {enrollment: ''},
           gradeLevelData: this.props.inputGradeLevelData,
           id: this.props.id,
           passValue: this.props.passValue,
           gLStyle: this.props.gLStyle
        };
    }

   
    componentDidMount(){
    }
    componentDidUpdate(prevProps){
    }

    render(){
        let valAsString = this.props.inputGradeLevelData.gradeLevel.substring(4,this.props.inputGradeLevelData.gradeLevel.length);        
        let valAsInt = parseInt(valAsString);
        let trimmedLevel = trimIt(this.props.inputGradeLevelData.gradeLevel.substring(1,3));//this.state.gradeLevel does not have leading 'I' but could have leading 0
        let counts = null;
        let isReadOnly = true;
        if (this.state.passValue > -99) {
            return(
                <div>
                    <div>
                    </div>
                    <div id="container">
                        <span id = "levels">
                        <label style={{paddingright: 1}}>{trimmedLevel}:</label>
                        </span>
                        <span className="ggspan">
                            <input  type="number"
                                    style={{width: '50px'}}
                                    id={this.state.id}
                                    onChange={this.props.change}
                                    defaultValue={this.state.gradeLevelData.value}
                            />
                            </span>
                    </div>
                </div>
            );
        
        } else {
            
            return(
                <div>
                    <div className="row" style={{ 'marginBottom': '8px', 'marginTop': '2px' }} id="container">
                        <span id = "levels">
                        <label style={{paddingright: 1, width: '25px'}}>{trimmedLevel}:</label>
                        </span>
                        <div className=" col-md-4 col-lg-4 col-sm-4">
                            <input  type="text"
                                    style={{width: '25px'}}
                                    id={this.state.id}
                                    onChange={this.props.change}
                                    value={'\u2714'}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }         
}

InputGradeLevelControls.propTypes = {
    passValue: PropTypes.number,
    change: PropTypes.func,
    id: PropTypes.string,
    gradeLevel: PropTypes.string,
    value: PropTypes.number,
    inputGradeLevelData: PropTypes.object,
    gLStyle: PropTypes.object
};

export default InputGradeLevelControls;
 
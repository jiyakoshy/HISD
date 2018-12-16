import React from 'react';


class GradeLevelInputPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
           formErrors: {enrollment: ''},
           gradeLevel: props.inputGradeLevelData
        };
        }//end constructor
    
        
        
          validateField(fieldName, value) {
            let fieldValidationErrors = this.state.formErrors;
            let emailValid = this.state.emailValid;
            let passwordValid = this.state.passwordValid;
        
            switch(fieldName) {
              case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
              case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' is too short';
                break;
              default:
                break;
            }
            this.setState({formErrors: fieldValidationErrors,
                            emailValid: emailValid,
                            passwordValid: passwordValid
                          }, this.validateForm);
          }
        
          validateForm() {
            this.setState({formValid: this.state.enrollmentValid });// use && to test other values for validity true/false, e.g. && this.state.passwordValid
          }
        
          errorClass(error) {
            return(error.length === 0 ? '' : 'has-error');
          }
        
          
	render(){
   
    
    
		let self = this;
		
    return (   <div className="heightwidth"> <button  onClick={this.Test} id={this.state.gradeLevel}  className="box"
        ref={function(el) {self._input = el;}}>{this.state.gradeLevel}<br/><strong>123</strong></button></div>);      
          
  }
}

export default GradeLevelInputPage;
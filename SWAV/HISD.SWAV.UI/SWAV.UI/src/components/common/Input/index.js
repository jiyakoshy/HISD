import PropTypes from 'prop-types';
import classnames from 'classnames';
import React from 'react';

class Input extends React.PureComponent {
  render() {
    const {
      type,
      placeholder,
      name,
      onChange,
      clearHandler,
      hasError,
      required,
      errorMessage,
      parentClassName,
      labelClassName,
      className,
      ...otherProps
    } = this.props;

    const cleanedUpName = name.replace(/\s+/g, '-');
    const inputClassNames = classnames(
      `rights-input__element rights-input__element--${type}`,
      className,
      {
        'rights-input__element--error' : hasError
      }
    );

    return (
      <div className={classnames('rights-input', parentClassName)}>
        <input
          id={`${cleanedUpName}-id`}
          className={inputClassNames}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          onKeyPress={e => e.key === 'Enter' && onChange(e)}
          aria-required={required}
          {...otherProps}
        />


        {errorMessage &&
          hasError && <span className="error-message">{errorMessage}</span>}
      </div>
    );
  }
}

Input.propTypes = {
  type : PropTypes.string,
  name : PropTypes.string.isRequired,
  placeholder : PropTypes.string,
  onChange : PropTypes.func
};

Input.defaultProps = {
  type : 'text',
  placeholder : 'Type here',
  hasError : false,
  parentClassName : '',
  labelClassName : '',
  name : '',
  className : '',
  required : false,
  errorMessage : ''
};

export default Input;

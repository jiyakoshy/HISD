import React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

const departmentDropDown = (props) => {

    if (props.showSchoolDropDown != "No")
        return (<div className="dropDownPageHeader pull-right">
            <b className="hidden-xs" >
                <Dropdown options={props.options}
                    placeHolder={props.placeHolder}
                    onChanged={props.onChanged}
                    selectedKey={props.selectedKey}
                    disabled={props.disabled} /> </b>
        </div>);
    else
        return (<div className="dropDownPageHeader pull-right">
            
        </div>);
}

export default departmentDropDown;

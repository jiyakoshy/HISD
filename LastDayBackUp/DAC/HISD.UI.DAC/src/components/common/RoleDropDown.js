import React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

const roleDropDown = (props) => {

    if (props.selectedKey)
        return (<ul className="nav navbar-top-links pull-right">
            <li className="dropdown">
                <a className="profile-pic">
                    <b className="hidden-xs">
                        <Dropdown options={props.options} onChanged={props.onChanged} selectedKey={props.selectedKey} style={props.style} />

                    </b>
                </a>
            </li>
        </ul>);
    else
        return (<ul className="nav navbar-top-links pull-right">
            <li className="dropdown">
                <a className="profile-pic">
                    <b className="hidden-xs">
                    </b>
                </a>
            </li>
        </ul>);
}

export default roleDropDown;

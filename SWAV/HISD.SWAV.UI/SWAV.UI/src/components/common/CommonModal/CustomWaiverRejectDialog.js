import React from 'react';
import PropTypes from 'prop-types';
import { DefaultButton, PrimaryButton, IconButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';

class CustomWaiverRejectDialog extends React.Component {

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onChangeWaiverComment = this.onChangeWaiverComment.bind(this);
        this.state = {
            waiverComment :''
        }
    }

    closeModal(data) {
        const { toggleDeleteModal } = this.props;
        toggleDeleteModal(false);
    }

    onChangeWaiverComment(e) {
        this.setState({ waiverComment: e.target.value });
    }

    rejectWavier(){
        const { waiverComment } = this.state;
        this.props.rejectCustomWaiverCallBack(waiverComment);
    }

    render() {
        const { text, heading, data } = this.props;
        return (
            <div className="row">
                <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4%', marginLeft: '2%'}}>
                    <span>{heading}</span>
                </div>
                <div style={{marginLeft:'2%'}}>
                    <span>{text} <span style={{fontWeight:'bold'}}>{data.WaiverName}</span> waiver ?</span>
                </div>
                <div className="form-group" style={{marginLeft: '2%', marginRight: '2%'}}>
                    <label>Comments</label>
                    <div>
                        <textarea value={this.state.waiverComment} id="waiverComment" onChange={this.onChangeWaiverComment} rows="4" className="form-control"></textarea>
                    </div>
                </div>
                <DefaultButton text="Cancel" onClick={this.closeModal} style={{marginTop: '6%', marginLeft: '2%'}}/>
                <PrimaryButton text="Reject" onClick={()=> this.rejectWavier()} className="pull-right" style={{marginTop: '6%', marginRight:'2%', backgroundColor:'#d9534f'}}/>
            </div>
        );
    }
}

export default CustomWaiverRejectDialog;
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { hashHistory } from 'react-router-dom';
import LinkFormatter from '../common/formatters/linkFormatter';

export default class MenteesTable extends React.Component {
    render() {
      if (this.props.data && this.props.data.length > 0) {
        return (
          <BootstrapTable data={this.props.data}>
            <TableHeaderColumn dataField="StaffNaturalKey" isKey>Mentee Employee ID</TableHeaderColumn>
            <TableHeaderColumn dataField="MenteeName">Mentee Name</TableHeaderColumn>
            <TableHeaderColumn dataField="VerificationStatus">Verification Status</TableHeaderColumn>
            <TableHeaderColumn dataField="VerificationCommentCode">Comments Code</TableHeaderColumn>
            <TableHeaderColumn dataField="VerificationCommentDescription">Comments</TableHeaderColumn>
          </BootstrapTable>);
      } else {
          return (<div></div>);
      }
    }
}

MenteesTable.propTypes = {
  data: PropTypes.array
};

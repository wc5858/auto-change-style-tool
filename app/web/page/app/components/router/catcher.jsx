import React, { Component } from 'react';
import { connect } from 'react-redux';

class Catcher extends Component {
  render() {
    return <div className="redux-nav-item"></div>;
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {})(Catcher);

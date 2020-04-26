import React from 'react';
import './Loader.css';

export default class Loader extends React.PureComponent {
  render() {
    return (
      <div className="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  }
}

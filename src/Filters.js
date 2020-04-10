import React from 'react';
import PropTypes from 'prop-types';
import './Filters.css';

class Filters extends React.Component {
  matchStartTime( event ) {
    const { setStartTime } = this.props;
    const startTime = event.target.value;
    setStartTime( startTime );
  }

  matchEndTime( event ) {
    const { setEndTime } = this.props;
    const endTime = event.target.value;
    setEndTime( endTime );
  }

  static renderOptions( startTime, endTime ) {
    const options = [<option key="0" value="" disabled>Select time</option>];
    for ( let i = startTime; i <= endTime; ) {
      let time = i;
      if ( time >= 2400 ) {
        time = ( time - 2400 ).toString();
        while ( time.length < 4 ) time = `0${time}`;
      }
      time = time.toString();
      options.push( <option key={i} value={i}>{ `${time.slice( 0, 2 )}:${time.slice( 2 )}` }</option> );
      i += i % 100 === 0 ? 30 : 70;
    }
    return options;
  }

  render() {
    const { startTime } = this.props;
    const { endTime } = this.props;
    return (
      <div className="card">
        <div className="filters">
          <div className="filter">
            <label htmlFor="start-time">
              <span className="label-text">Start</span>
              <select id="start-time" onChange={( event ) => this.matchStartTime( event )} value={startTime}>
                { Filters.renderOptions( 1330, 2430 ) }
              </select>
            </label>
          </div>
          <div className="filter">
            <label htmlFor="end-time">
              <span className="label-text">End</span>
              <select id="end-time" onChange={( event ) => this.matchEndTime( event )} value={endTime}>
                { Filters.renderOptions( 1400, 2500 ) }
              </select>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

Filters.propTypes = {
  setStartTime: PropTypes.func.isRequired,
  setEndTime: PropTypes.func.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
};

export default Filters;

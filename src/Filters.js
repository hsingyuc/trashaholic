import React from 'react';
import './Filters.css';

class Filters extends React.Component {
    matchStartTime( event ) {
        const startTime = event.target.value;
        this.props.setStartTime( startTime );
    }

    matchEndTime( event ) {
        const endTime = event.target.value;
        this.props.setEndTime( endTime );
    }

    render() {
        return(
            <div className='filters'>
                <label htmlFor="start-time"></label>
                <select id="start-time" onChange={ event => this.matchStartTime( event ) } value={ this.props.startTime }>
                    <option value="Start time">Start time</option>
                    <option value="1700">17:00</option>
                    <option value="1730">17:30</option>
                    <option value="1800">18:00</option>
                    <option value="1830">18:30</option>
                </select>
                <label htmlFor="end-time"></label>
                <select id="end-time" onChange={ event => this.matchEndTime( event ) } value={ this.props.endTime }>
                    <option value="End time">End time</option>
                    <option value="1730">17:30</option>
                    <option value="1800">18:00</option>
                    <option value="1830">18:30</option>
                    <option value="1900">19:00</option>
                </select>
            </div>


        );
    }
}

export default Filters;
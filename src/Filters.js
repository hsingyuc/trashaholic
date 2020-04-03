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
                <label for="start-time">Start time:</label>
                <select id="start-time" onChange={ event => this.matchStartTime( event ) } value={ this.props.startTime }>
                    <option value="17:00">17:00</option>
                    <option value="17:30">17:30</option>
                    <option value="18:00">18:00</option>
                    <option value="18:30">18:30</option>
                </select>
                <label for="end-time">End time:</label>
                <select id="end-time" onChange={ event => this.matchEndTime( event ) } value={ this.props.endTime }>
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
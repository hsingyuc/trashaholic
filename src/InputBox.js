import React from 'react';
import './InputBox.css';

class InputBox extends React.Component {
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
            <div className='input-time'>
                <input type="text" onChange={ event => this.matchStartTime( event ) } value={ this.props.startTime } placeholder='1700' />
                <input type="text" onChange={ event => this.matchEndTime( event ) } value={ this.props.endTime } placeholder='1800'/>
            </div>
        );
    }
}

export default InputBox;
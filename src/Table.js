import React from 'react';
import './Table.css';

class Table extends React.Component {
    renderTable() {
        return this.props.collectionPlaces.map( ( data, index ) => {
            const { car, distance, time, location } = data;

            return <tr key={ index }>
                    <td>{ car }</td>
                    <td>{ time }</td>
                    <td>{ location }</td>
                    <td>{ this.getFormattedDistance(distance) }</td>
                </tr>
        });
    }

    getFormattedDistance( distance ) {
        if ( ! distance ) {
            return '';
        }

        if ( distance >= 1000 ) {
            return parseInt( distance / 1000 ) + 'km';
        }

        return parseInt( distance ) + 'm';
    }

    render() {
        return (
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <td>Car</td>
                            <td>Time</td>
                            <td>Location</td>
                            <td>Distance</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderTable() }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table;
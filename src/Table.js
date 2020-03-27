import React from 'react';
import './Table.css';

class Table extends React.Component {
    renderTable() {
        return this.props.collectionPlaces.map( ( data, index ) => {
            const { car, time, location } = data;
            return <tr key={ index }>
                    <td>{ car }</td>
                    <td>{ time }</td>
                    <td>{ location }</td>
                </tr>
        });
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
                    </tr>
                </thead>
                <tbody>
                    { this.renderTable() }
                </tbody>
            </table>
          </div>
        )
    }
}

export default Table;
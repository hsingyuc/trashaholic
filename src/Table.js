import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';
import Place from './Place';

class Table extends React.PureComponent {
  render() {
    const { collectionPlaces } = this.props;
    return (
      <div>
        <ul className="list">
          {
            collectionPlaces.map( ( data ) => (
              <li key={data.id} className="row">
                <Place data={data} />
              </li>
            ) )
            }
        </ul>
      </div>
    );
  }
}

Table.propTypes = {
  collectionPlaces: PropTypes.arrayOf( PropTypes.object ).isRequired,
};

export default Table;

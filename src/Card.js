import React from 'react';
import './Card.css';
import PropTypes from 'prop-types';
import Place from './Place';

class Card extends React.PureComponent {
  render() {
    const { place } = this.props;
    return (
      <div key={place.id} className="card-wrapper">
        <Place data={place} />
      </div>
    );
  }
}

Card.propTypes = {
  place: PropTypes.shape( {
    id: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    distance: PropTypes.number,
  } ).isRequired,
};

export default Card;

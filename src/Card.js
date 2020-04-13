import React from 'react';
import './Card.css';
import PropTypes from 'prop-types';
import Table from './Table';

class Card extends React.PureComponent {
  render() {
    const { place } = this.props;
    const {
      distance, startTime, endTime, address, id,
    } = place;
    return (
      <div key={id} className="card-wrapper">
        <li className="row">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30ZM20.1693 12.2923C20.1693 15.1688 17.252 22.084 14.8773 22.084C12.5026 22.084 9.58594 15.1688 9.58594 12.2923C9.58594 9.41583 12.0008 7.08398 14.8773 7.08398C17.7538 7.08398 20.1693 9.41583 20.1693 12.2923ZM17.5 12.5C17.5 13.8807 16.3807 15 15 15C13.6193 15 12.5 13.8807 12.5 12.5C12.5 11.1193 13.6193 10 15 10C16.3807 10 17.5 11.1193 17.5 12.5Z" fill="#D5DDE0" /></svg>
          <span className="info-wrapper">
            <span className="address">{ address }</span>
            <span className="time-distance">
              <span>
                { `${startTime}-${endTime}` }
              </span>
              <span>{ Table.getFormattedDistance( distance ) }</span>
            </span>
          </span>
        </li>
      </div>
    );
  }
}

Card.propTypes = {
  place: PropTypes.objectOf( PropTypes.object ).isRequired,
};

export default Card;
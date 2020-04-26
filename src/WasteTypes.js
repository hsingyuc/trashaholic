import React from 'react';
import './WasteTypes.css';
import { GiFishbone } from 'react-icons/gi';
import { FaRegTrashAlt, FaWineBottle } from 'react-icons/fa';
import { IoMdPaper } from 'react-icons/io';

class WasteTypes extends React.PureComponent {
  render() {
    const d = new Date();
    switch ( d.getDay() ) {
      case 1:
      case 5:
        return (
          <div className="react-icon">
            <FaRegTrashAlt />
            <GiFishbone />
            <IoMdPaper />
            <span>Flat recyclable day!</span>
          </div>
        );
      case 2:
      case 4:
      case 6:
        return (
          <div className="react-icon">
            <FaRegTrashAlt />
            <GiFishbone />
            <FaWineBottle />
            <span>Bulky recyclable day!</span>
          </div>
        );
      default:
        return <p className="react-icon">No trash today!!!</p>;
    }
  }
}

export default WasteTypes;

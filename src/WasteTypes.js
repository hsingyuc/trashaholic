import React from 'react';
import './WasteTypes.css';
import { GiFishbone } from 'react-icons/gi';
import { FaRegTrashAlt, FaWineBottle } from 'react-icons/fa';
import { IoMdPaper } from 'react-icons/io';

class WasteTypes extends React.Component {
    render() {
        const d = new Date();
        switch( d.getDay() ) {
            case 1:
            case 5:
                return(
                    <div className='react-icon'>
                        <FaRegTrashAlt />
                        <GiFishbone />
                        <IoMdPaper />
                        <p>Flat recyclable day!</p>
                    </div>
                );
                break;
            case 2:
            case 4:
            case 6:
                return(
                    <div className='react-icon'>
                        <FaRegTrashAlt />
                        <GiFishbone />
                        <FaWineBottle />
                        <p>Bulky recyclable day!</p>
                    </div>
                );
                break;
            default:
                return <p>Not today!!!</p>;
        }
    }
}

export default WasteTypes;
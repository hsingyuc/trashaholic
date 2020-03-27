import React from 'react';
import './RecycleItem.css';
import { GiFishbone } from 'react-icons/gi';
import { FaRegTrashAlt, FaWineBottle } from 'react-icons/fa';
import { IoMdPaper } from 'react-icons/io';

class RecycleItem extends React.Component {
    renderRecycleItem() {
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

    render() {
        return this.renderRecycleItem();
    }
}

export default RecycleItem;
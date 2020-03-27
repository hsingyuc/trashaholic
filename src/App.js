import React from 'react';
import './App.css';
import Table from './Table.js';
import Map from './Map.js';
import RecycleItem from './RecycleItem.js';
import InputBox from './InputBox.js';

class App extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
        collectionPlaces: [],
        startTime: '',
        endTime: '',
    };
  }

  componentDidMount() {
    this.getCollectionData();
  }

  getCollectionData() {
    fetch( 'http://localhost:3000/collection_times2.json' )
      .then( ( response ) => response.json() )
      .then( ( collectionPlaces ) => { 
        return collectionPlaces.map( ( place ) => {
            const [ collectStartTime, collectEndTime ] = place.time.split( '-' );
            place.startTime = collectStartTime.split(':');
            place.endTime = collectEndTime.split(':');
            return place;
        } );
       } )
      .then( ( collectionPlaces ) => this.setState( { collectionPlaces } ) )
  }

  getFilteredPlaces() {
    const filteredByStart = this.state.startTime.length
        ? this.state.collectionPlaces.filter( place => place.time.replace(':','') >= this.state.startTime.replace(':','') )
        : this.state.collectionPlaces;
    const filteredByEnd = this.state.endTime.length
        ? filteredByStart.filter( place => place.time.replace(':','') <= this.state.endTime.replace(':','') )
        : filteredByStart;
    return filteredByEnd;
  }
 
  render() {
    const { collectionPlaces } = this.state;
    if( ! collectionPlaces.length ) {
        return <div>Loading...</div>
    }
  
    const filteredPlaces = this.getFilteredPlaces();
    return (
      <div>
          <InputBox
              startTime={ this.state.startTime }
              endTime={ this.state.endTime }
              setStartTime={ time => this.setState( { startTime: time } ) }
              setEndTime={ time => this.setState( { endTime: time } ) }
          />
          <RecycleItem />
          <div className='info-container'>
              <Table collectionPlaces={ filteredPlaces } />
              <Map collectionPlaces={ filteredPlaces } />
          </div>
      </div>
    );
  }
}

export default App;

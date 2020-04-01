import React from 'react';
import './App.css';
import Table from './Table.js';
import Map from './Map.js';
import WasteTypes from './WasteTypes.js';
import Filters from './Filters.js';
import { getGoogleMapsPromise } from './utils';

class App extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
        collectionPlaces: [],
        currentPosition: null,
        startTime: '',
        endTime: '',
        isTableView: true,
        google: null,
    };
  }

  componentDidMount() {
    getGoogleMapsPromise().then( () => this.setState( { google: window.google } ) );
    this.setCurrentPosition();
    this.getCollectionData();
  }

  componentDidUpdate( prevProps, prevState ) {
    const { google, currentPosition } = this.state;
    const { google: prevGoogle, currentPosition: prevCurrentPosition } = prevState;

    if (
      ( google && currentPosition ) &&
      ( ! prevGoogle || ! prevCurrentPosition )
    ) {
      this.addDistanceInfo();
    }
  }

  addDistanceInfo() {
    const updatedPlaces = this.state.collectionPlaces.map( place => {
        var distance = this.state.google.maps.geometry.spherical.computeDistanceBetween(
          new this.state.google.maps.LatLng( parseFloat( place.latitude ), parseFloat( place.longitude ) ),
          new this.state.google.maps.LatLng( this.state.currentPosition.lat, this.state.currentPosition.lng ),
        );
        place.distance = distance;
        return place;
    } );
    const sortedPlaces = updatedPlaces.sort( ( a, b ) => {
      return a.distance - b.distance;
    } );
    this.setState( { collectionPlaces: sortedPlaces } );
  }

  setCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( position => {
          const currentPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          };
          this.setState( { currentPosition } );
      } );
    }
  }

  getCollectionData() {
    fetch( 'http://localhost:3000/collection_times2.json' )
      .then( ( response ) => response.json() )
      .then( ( collectionPlaces ) => { 
        return collectionPlaces.map( ( place ) => {
            const [ collectStartTime, collectEndTime ] = place.time.split( '-' );
            place.startTime = collectStartTime;
            place.endTime = collectEndTime;
            return place;
        } );
       } )
      .then( ( collectionPlaces ) => this.setState( { collectionPlaces } ) )
  }

  getFilteredPlaces() {
    let filteredPlaces = this.state.startTime.length
        ? this.state.collectionPlaces.filter( place => place.time.replace(':','') >= this.state.startTime.replace(':','') )
        : this.state.collectionPlaces;
    filteredPlaces = this.state.endTime.length
        ? filteredPlaces.filter( place => place.time.replace(':','') <= this.state.endTime.replace(':','') )
        : filteredPlaces;

    return filteredPlaces;
  }

  isWithinRange() {
    let isWithinRange = false;
    this.getFilteredPlaces().forEach( place => {
        if ( ! place.distance || place.distance < 9994000 ) {
            isWithinRange = true;
        }
    } );
    return isWithinRange;
  }

  render() {
    const { collectionPlaces, currentPosition, isTableView } = this.state;
    if( ! collectionPlaces.length ) {
        return <div>Loading...</div>
    }

    const filteredPlaces = this.getFilteredPlaces();

    return (
      <div>
          <Filters
              startTime={ this.state.startTime }
              endTime={ this.state.endTime }
              setStartTime={ time => this.setState( { startTime: time } ) }
              setEndTime={ time => this.setState( { endTime: time } ) }
          />
          <WasteTypes />
          <button onClick={ () => this.setState( { isTableView: ! isTableView } ) }>
            { isTableView ? 'Map' : 'Table' }
          </button>
          <div className='info-container'>
              { isTableView
                ? <Table 
                    collectionPlaces={ filteredPlaces.slice(0,11) }
                  />
                : <Map
                    collectionPlaces={ filteredPlaces }
                    currentPosition={ currentPosition }
                  />
              }
          </div>
      </div>
    );
  }
}

export default App;

import React from 'react';
import './App.css';
import Table from './Table';
import Place from './Place';
import Map from './Map';
import WasteTypes from './WasteTypes';
import Filters from './Filters';
import { getGoogleMapsPromise } from './utils';
import Card from './Card';

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
      selectedPlace: null,
    };
  }

  componentDidMount() {
    getGoogleMapsPromise().then( () => this.setState( { google: window.google } ) );
    this.setCurrentPosition();
    this.getCollectionData();
  }

  componentDidUpdate( prevProps, prevState ) {
    const { google, collectionPlaces, currentPosition } = this.state;
    const {
      google: prevGoogle,
      collectionPlaces: prevCollectionPlaces,
      currentPosition: prevCurrentPosition,
    } = prevState;

    if (
      ( google && currentPosition && collectionPlaces.length )
      && ( !prevGoogle || !prevCurrentPosition || !prevCollectionPlaces.length )
    ) {
      this.addDistanceInfo();
    }
  }

  setCurrentPosition() {
    if ( navigator.geolocation ) {
      navigator.geolocation.getCurrentPosition( ( position ) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.setState( { currentPosition } );
      } );
    }
  }

  getCollectionData() {
    fetch( 'http://localhost:3000/formatted_places.json' )
      .then( ( response ) => response.json() )
      .then( ( collectionPlaces ) => collectionPlaces.map( ( place ) => {
        const newPlace = place;
        newPlace.lat = parseFloat( place.lat );
        newPlace.lng = parseFloat( place.lng );
        newPlace.getStartTimeInt = function () {
          return parseInt( this.startTime.replace( ':', '' ), 10 );
        };
        newPlace.getEndTimeInt = function () {
          return parseInt( this.endTime.replace( ':', '' ), 10 );
        };
        return newPlace;
      } ) )
      .then( ( collectionPlaces ) => this.setState( { collectionPlaces } ) );
  }

  getFilteredPlaces() {
    const { startTime } = this.state;
    const { endTime } = this.state;
    const { collectionPlaces } = this.state;
    let filteredPlaces = startTime.length
      ? collectionPlaces.filter( ( place ) => place.getStartTimeInt() >= startTime )
      : collectionPlaces;
    filteredPlaces = endTime.length
      ? filteredPlaces.filter( ( place ) => {
        let placeEndTime = place.getEndTimeInt();
        if ( endTime - place.getStartTimeInt() < 0 ) {
          placeEndTime += 2400;
        }
        return placeEndTime <= endTime;
      } )
      : filteredPlaces;

    return filteredPlaces;
  }

  addDistanceInfo() {
    const { google, collectionPlaces, currentPosition } = this.state;
    const updatedPlaces = collectionPlaces.map( ( place ) => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng( place.lat, place.lng ),
        new google.maps.LatLng( currentPosition.lat, currentPosition.lng ),
      );
      return {
        ...place,
        distance,
      };
    } );
    const sortedPlaces = updatedPlaces.sort( ( a, b ) => a.distance - b.distance );
    this.setState( { collectionPlaces: sortedPlaces } );
  }

  isWithinRange() {
    let isWithinRange = false;
    this.getFilteredPlaces().forEach( ( place ) => {
      if ( !place.distance || place.distance < 9994000 ) {
        isWithinRange = true;
      }
    } );
    return isWithinRange;
  }

  render() {
    const { collectionPlaces, currentPosition, isTableView } = this.state;
    if ( !collectionPlaces.length ) {
      return <div>Loading...</div>;
    }

    const filteredPlaces = this.getFilteredPlaces();
    const { startTime, endTime, selectedPlace } = this.state;
    return (
      <div>
        <div className="main-section">
          <button type="button" className="button-icon" onClick={() => this.setState( { isTableView: !isTableView } )}>
            { isTableView
              ? (
                <svg id="Capa_1" enableBackground="new 0 0 512 512" height="25px" viewBox="0 0 512 512" width="25px">
                  <g>
                    <path d="m307.79 223.476-53.135 78.467-78.573 78.18c-29.222-37.139-61.132-73.116-80.587-116.631l42.352-64.879 64.957-62.668c-21.71 26.831-20.089 66.293 4.864 91.246 26.696 26.696 69.968 26.696 96.663 0 1.203-1.203 2.365-2.446 3.459-3.715z" fill="#ecb72b" />
                    <path d="m309.02 222.003c21.9-26.844 20.346-66.442-4.688-91.462-26.696-26.696-69.968-26.696-96.663 0-1.121 1.121-2.189 2.27-3.215 3.445l44.811-72.847 60.795-52.809c45.407 14.374 82.964 46.379 104.648 87.977l-44.352 71.516z" fill="#5085f7" />
                    <path d="m202.802 135.949-107.312 127.549c-10.643-23.783-17.562-49.817-18.276-79.529-.054-1.689-.081-3.391-.081-5.093 0-43.718 15.685-83.789 41.746-114.861z" fill="#da2f2a" />
                    <path d="m202.802 135.949-83.926-71.939c32.816-39.125 82.06-64.01 137.126-64.01 18.845 0 37.009 2.916 54.065 8.32z" fill="#4274eb" />
                    <path d="m434.867 178.865c0-29.779-7.278-57.859-20.151-82.558l-238.64 283.826c27.113 34.488 51.887 69.985 62.183 113.454.33 1.392.685 3.019 1.063 4.848 3.733 18.086 29.63 18.086 33.363 0 .378-1.829.733-3.456 1.063-4.848 27.448-115.892 157.807-175.118 161.043-309.618.046-1.696.076-3.397.076-5.104z" fill="#60a850" />
                  </g>
                </svg>
              )
              : (
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18 2H0V0H18V2ZM0 11H24V9H0V11ZM0 20H12V18H0V20Z" fill="#CE8467" />
                </svg>
              ) }
          </button>
          { isTableView
            ? (
              <div className="table-wrapper">
                <Filters
                  startTime={startTime}
                  endTime={endTime}
                  setStartTime={( time ) => this.setState( { startTime: time } )}
                  setEndTime={( time ) => this.setState( { endTime: time } )}
                />
                <WasteTypes />
                <Table
                  collectionPlaces={filteredPlaces.slice( 0, 10 )}
                />
              </div>
            )
            : (
              <div>
                <Map
                  collectionPlaces={filteredPlaces.slice( 0, 10 )}
                  currentPosition={currentPosition}
                  setSelectedPlace={( place ) => this.setState( { selectedPlace: place } )}
                />
                {/* if we have selectedPlace then render card  */}
                {selectedPlace
                  && (
                  <Card
                    place={selectedPlace}
                  />
                  )}
              </div>
            ) }
        </div>
      </div>
    );
  }
}

export default App;

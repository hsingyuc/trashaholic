import React from 'react';
import './App.css';
import { FiMenu } from 'react-icons/fi';
import Table from './Table';
import Map from './Map';
import WasteTypes from './WasteTypes';
import Filters from './Filters';
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
    const { startTime } = this.state;
    const { endTime } = this.state;
    return (
      <div>
        <div className="main-section">
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
                <button type="button" className="button-icon" onClick={() => this.setState( { isTableView: !isTableView } )}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M19.9751 28.5V18.75" stroke="#3E4958" strokeWidth="2" strokeLinecap="round" />
                    <g filter="url(#filter0_d)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M19.9751 20.9165C22.6675 20.9165 24.8501 18.7339 24.8501 16.0415C24.8501 13.3491 22.6675 11.1665 19.9751 11.1665C17.2827 11.1665 15.1001 13.3491 15.1001 16.0415C15.1001 18.7339 17.2827 20.9165 19.9751 20.9165Z" fill="#1152FD" />
                    </g>
                    <ellipse cx="18.3502" cy="14.4168" rx="1.08333" ry="1.08333" fill="white" />
                    <defs>
                      <filter id="filter0_d" x="0.100098" y="0.166504" width="39.75" height="39.75" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="7.5" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                      </filter>
                    </defs>
                  </svg>
                  { isTableView ? 'Show on a map' : <FiMenu /> }
                </button>
                <Table
                  collectionPlaces={filteredPlaces.slice( 0, 10 )}
                />
              </div>
            )
            : (
              <Map
                collectionPlaces={filteredPlaces.slice( 0, 10 )}
                currentPosition={currentPosition}
              />
            )}
        </div>
      </div>
    );
  }
}

export default App;

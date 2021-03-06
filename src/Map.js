import React from 'react';
import PropTypes from 'prop-types';
import './Map.css';
import Card from './Card';
import { getGoogleMapsPromise } from './utils';

class Map extends React.Component {
  static arraysEqual( a, b ) {
    if ( a === b ) return true;
    if ( a == null || b == null ) return false;
    if ( a.length !== b.length ) return false;

    for ( let i = 0; i < a.length; ++i ) {
      if ( a[i] !== b[i] ) return false;
    }
    return true;
  }

  constructor( props ) {
    super( props );
    this.initMap = this.initMap.bind( this );
    this.mapRef = React.createRef();
    this.state = {
      markers: [],
      selectedPlace: null,
    };
  }

  componentDidMount() {
    getGoogleMapsPromise().then( () => this.initMap() );
  }

  componentDidUpdate( prevProps ) {
    const { collectionPlaces, currentPosition } = this.props;
    const newLineIds = collectionPlaces.map( ( place ) => place.lineid );
    const oldLineIds = prevProps.collectionPlaces.map( ( place ) => place.lineid );

    if ( !Map.arraysEqual( newLineIds, oldLineIds ) ) {
      this.renderMarkers();
    }

    if ( currentPosition !== prevProps.currentPosition ) {
      this.renderCurrentPosition();
    }

    this.fitMap();
  }

  initMap() {
    this.google = window.google;

    this.map = new this.google.maps.Map(
      this.mapRef.current, // current is the DOM element for the reference.
      {
        zoomControl: false,
        fullscreenControl: false,
        styles: [
          {
            elementType: 'geometry',
            stylers: [
              {
                color: '#f5f5f5',
              },
            ],
          },
          {
            elementType: 'labels.icon',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#616161',
              },
            ],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#f5f5f5',
              },
            ],
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#bdbdbd',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              {
                color: '#eeeeee',
              },
            ],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#757575',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [
              {
                color: '#e5e5e5',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#9e9e9e',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
              {
                color: '#ffffff',
              },
            ],
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#757575',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [
              {
                color: '#dadada',
              },
            ],
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#616161',
              },
            ],
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#9e9e9e',
              },
            ],
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [
              {
                color: '#e5e5e5',
              },
            ],
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [
              {
                color: '#eeeeee',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [
              {
                color: '#c9c9c9',
              },
            ],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#9e9e9e',
              },
            ],
          },
        ],
      },
    );

    this.renderMarkers();
    this.renderCurrentPosition();
  }

  deletemarkers() {
    const { markers } = this.state;
    markers.forEach( ( marker ) => marker.setMap( null ) );
  }

  fitMap() {
    if ( !this.google ) {
      return;
    }

    const bounds = new this.google.maps.LatLngBounds();
    const { markers } = this.state;
    const { currentPosition } = this.props;

    if ( currentPosition ) {
      const currentPositiongLatLng = new this.google.maps.LatLng(
        currentPosition.lat, currentPosition.lng,
      );
      bounds.extend( currentPositiongLatLng );
    }

    for ( let i = 0; i < markers.length && i < 5; i++ ) {
      bounds.extend( markers[i].getPosition() );
    }

    this.map.fitBounds( bounds );
    this.map.panToBounds( bounds );
  }

  renderCurrentPosition() {
    const { currentPosition } = this.props;

    if ( !currentPosition ) {
      return;
    }

    const image = `${process.env.PUBLIC_URL}/ic_cloc.png`;
    const marker = new this.google.maps.Marker(
      {
        position: currentPosition,
        map: this.map,
        icon: {
          url: image,
          size: new this.google.maps.Size( 56, 56 ),
          scaledSize: new this.google.maps.Size( 56, 56 ),
        },
      },
    );
  }

  renderMarkers() {
    if ( !this.google ) {
      return;
    }

    // Delete old markers before rendering new ones.
    this.deletemarkers();

    // The markers, positioned at EACH latLongs
    const { collectionPlaces } = this.props;
    const image = `${process.env.PUBLIC_URL}/ic_loc.png`;
    const markers = collectionPlaces.map( ( place ) => {
      const { lat, lng } = place;
      const marker = new this.google.maps.Marker( {
        position: { lat, lng },
        map: this.map,
        icon: {
          url: image,
          size: new this.google.maps.Size( 20, 26 ),
          scaledSize: new this.google.maps.Size( 20, 26 ),
        },
      } );

      marker.addListener( 'click', () => {
        this.setState( { selectedPlace: place } );
      } );

      return marker;
    } );

    this.setState( { markers } );
  }

  render() {
    const { selectedPlace } = this.state;
    return (
      <div className="map-wrapper">
        <div className="map" ref={this.mapRef} />
        {/* if we have selectedPlace then render card  */}
        {selectedPlace
              && (
              <Card
                place={selectedPlace}
              />
              )}
      </div>
    );
  }
}

Map.defaultProps = {
  currentPosition: null,
};

Map.propTypes = {
  collectionPlaces: PropTypes.arrayOf( PropTypes.object ).isRequired,
  currentPosition: PropTypes.objectOf( PropTypes.number ),
};

export default Map;

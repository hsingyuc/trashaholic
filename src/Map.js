import React from 'react';
import PropTypes from 'prop-types';
import './Map.css';
import { TiLocation } from 'react-icons/ti';
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
    };
  }

  componentDidMount() {
    getGoogleMapsPromise().then( () => this.initMap() );
  }

  componentDidUpdate( prevProps ) {
    const { collectionPlaces } = this.props;
    const newLineIds = collectionPlaces.map( ( place ) => place.lineid );
    const oldLineIds = prevProps.collectionPlaces.map( ( place ) => place.lineid );

    if ( !Map.arraysEqual( newLineIds, oldLineIds ) ) {
      this.rendermarkers();
    }

    this.fitMap();
  }

  initMap() {
    this.google = window.google;

    this.map = new this.google.maps.Map(
      this.mapRef.current, // current is the DOM element for the reference.
      { fullscreenControl: false },
    );

    this.rendermarkers();

    const { currentPosition } = this.props;
    const image = `${process.env.PUBLIC_URL}/ic_cloc.png`;
    if ( currentPosition ) {
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
    } else {
      this.handleLocationError( false, this.map.getCenter() );
    }
  }

  handleLocationError( browserHasGeolocation, pos ) {
    const marker = new this.google.maps.Marker();
    marker.setPosition( pos );
    marker.setContent( browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : 'Error: Your browser doesn\'t support geolocation.' );
    marker.open( this.map );
  }

  deletemarkers() {
    const { markers } = this.state;
    markers.forEach( ( marker ) => marker.setMap( null ) );
  }

  fitMap() {
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

  rendermarkers() {
    if ( !this.google ) {
      return;
    }

    // Delete old markers before rendering new ones.
    this.deletemarkers();

    // The markers, positioned at EACH latLongs
    const { collectionPlaces, setSelectedPlace } = this.props;
    const image = `${process.env.PUBLIC_URL}/ic_loc.png`;
    const markers = collectionPlaces.map( ( place ) => {
      const { lat, lng } = place;
      const marker = new this.google.maps.Marker( {
        position: { lat, lng },
        map: this.map,
        icon: {
          url: image,
          size: new this.google.maps.Size( 56, 56 ),
          scaledSize: new this.google.maps.Size( 56, 56 ),
        },
      } );

      marker.addListener( 'click', () => {
        setSelectedPlace( place );
      } );

      return marker;
    } );

    this.setState( { markers } );
  }

  render() {
    return (
      <div>
        <div className="map" ref={this.mapRef} />
      </div>
    );
  }
}

Map.propTypes = {
  collectionPlaces: PropTypes.arrayOf( PropTypes.object ).isRequired,
  currentPosition: PropTypes.objectOf( PropTypes.number ).isRequired,
  setSelectedPlace: PropTypes.func.isRequired,
};

export default Map;

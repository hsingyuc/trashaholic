import React from 'react';
import './Map.css';
import { getGoogleMapsPromise } from './utils';

class Map extends React.Component {
    constructor( props ) {
        super( props );
        this.initMap = this.initMap.bind( this );
        this.mapRef = React.createRef();
        this.state = {
            infoWindows: [],
        };
    }

    componentDidMount() {
        getGoogleMapsPromise().then( () => this.initMap() );
    }

    componentDidUpdate( prevProps ) {
        const newLineIds = this.props.collectionPlaces.map( place => place.lineid );
        const oldLineIds = prevProps.collectionPlaces.map( place => place.lineid );

        if ( ! this.arraysEqual( newLineIds, oldLineIds ) ) {
            this.renderInfoWindows();
        }

        this.fitMap();
    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
    }

    initMap() {
        this.google = window.google;

        this.map = new this.google.maps.Map(
            this.mapRef.current //current is the DOM element for the reference.
            // { zoom: 0 }
        );
            
        this.renderInfoWindows(); 

        if ( this.props.currentPosition ) {
            const marker = new this.google.maps.Marker(
                { 
                    position: this.props.currentPosition,
                    map: this.map,
                    icon: {                             
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    },
                }
            )
            //this.map.setCenter(this.props.currentPosition);
        } else {
            this.handleLocationError( false, this.map.getCenter() );
        }
    }

    handleLocationError( browserHasGeolocation, pos ) {
        const infoWindow = new this.google.maps.InfoWindow;
        infoWindow.setPosition(pos);
        infoWindow.setContent( browserHasGeolocation 
            ? 'Error: The Geolocation service failed.' 
            : 'Error: Your browser doesn\'t support geolocation.'
        );
        infoWindow.open(this.map);
    }

    deleteInfoWindows() {
        this.state.infoWindows.forEach( infoWindow => infoWindow.setMap(null) );
    }

    fitMap() {
        // console.log('fitmap');
        const bounds = new this.google.maps.LatLngBounds();
        const { infoWindows } = this.state;
        const { currentPosition } = this.props;

        if ( currentPosition ) {
            const currentPositiongLatLng = new this.google.maps.LatLng(currentPosition.lat, currentPosition.lng);
            bounds.extend( currentPositiongLatLng );
        }

        for(let i = 0; i < infoWindows.length && i < 5; i++ ) {
            bounds.extend( infoWindows[i].getPosition());  
        }
        
        this.map.fitBounds(bounds);
        this.map.panToBounds(bounds); 
    }
    
    renderInfoWindows() {
        if ( ! this.google ) {
            return;
        }

        // Delete old infoWindows before rendering new ones.
        this.deleteInfoWindows();

        // The infoWindows, positioned at EACH latLongs
        const infoWindows = this.props.collectionPlaces.map( place => {
            const { lat, lng } = place;
            const infoWindow = new this.google.maps.InfoWindow({
                position: { lat, lng },  
                content: place.startTime
            });
            infoWindow.open(this.map);

            return infoWindow;
        } );

        this.setState( { infoWindows } );
    }

    render() {
        return <div className='map' ref={ this.mapRef }></div>
    }
}

export default Map;
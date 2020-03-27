import React from 'react';
import './Map.css';

class Map extends React.Component {
    constructor( props ) {
        super( props );
        this.initMap = this.initMap.bind( this );
        this.mapRef = React.createRef();

        this.state = {
            markers: [],
        };
    }

    componentDidMount() {
        this.getGoogleMapsPromise().then( () => this.initMap() );
    }

    componentDidUpdate( prevProps ) {
        const newLineIds = this.props.collectionPlaces.map( place => place.lineid );
        const oldLineIds = prevProps.collectionPlaces.map( place => place.lineid );

        if ( ! this.arraysEqual( newLineIds, oldLineIds ) ) {
            this.renderMarkers();
        }
    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
    }

    getGoogleMapsPromise() {
        // If we haven't already defined the promise, define it
        if ( ! window.googleMapsPromise ) {
            window.googleMapsPromise = new Promise( ( resolve ) => {
                // Add a global handler for when the API finishes loading
                window.resolveGoogleMapsPromise = () => {
                    // Resolve the promise, we're done with this promise.
                    resolve();
                    // Delete the used resolver function.
                    delete window.resolveGoogleMapsPromise;
                };
        
                // Load the Google Maps API
                const script = document.createElement( "script" );
                const API = 'AIzaSyDfgM-gH4reFsyeZYzoecfGvoXg2aXro9s';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
                script.async = true;
                document.body.appendChild( script );
            } );
        }

        return window.googleMapsPromise;
    }

    getLatLongs() {
        return this.props.collectionPlaces.map( place => {
            // string to floating number
            const lng = parseFloat( place.longitude );
            const lat = parseFloat( place.latitude );
            return { lat, lng };
        });
    }

    initMap() {
        this.google = window.google;
        const latLongs = this.getLatLongs();
        
        this.map = new this.google.maps.Map(
            this.mapRef.current,
            { zoom: 4, center: latLongs[0] }
        );

        this.renderMarkers();   
    }

    deleteMarkers() {
        this.state.markers.forEach( marker => marker.setMap(null) );
    }
    
    renderMarkers() {
        if ( ! this.google ) {
            return;
        }

        // Delete old markers before rendering new ones.
        this.deleteMarkers();

        const latLongs = this.getLatLongs();

        // The marker, positioned at EACH latLongs
        const markers = latLongs.map( ( latLong ) => {
            const marker = new this.google.maps.Marker( { position: latLong, map: this.map } )
            return marker;
        } );

        this.setState( { markers } );
    }

    render() {
        return <div className='map' ref={ this.mapRef }></div>
    }
}

export default Map;
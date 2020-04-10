export const getGoogleMapsPromise = function () {
  // If we haven't already defined the promise, define it
  if ( !window.googleMapsPromise ) {
    window.googleMapsPromise = new Promise( ( resolve ) => {
      // Add a global handler for when the API finishes loading
      window.resolveGoogleMapsPromise = () => {
        // Resolve the promise, we're done with this promise.
        resolve();
        // Delete the used resolver function.
        delete window.resolveGoogleMapsPromise;
      };

      // Load the Google Maps API
      const script = document.createElement( 'script' );
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&callback=resolveGoogleMapsPromise&language=en&libraries=geometry`;
      script.async = true;
      document.body.appendChild( script );
    } );
  }

  return window.googleMapsPromise;
};

export default {
  getGoogleMapsPromise,
};

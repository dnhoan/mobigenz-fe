// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    apiKey: 'AIzaSyDwPaU6eWI8EDqbjsNiavlnzmCpcax4588',
    authDomain: 'mobigenz2.firebaseapp.com',
    projectId: 'mobigenz2',
    storageBucket: 'mobigenz2.appspot.com',
    messagingSenderId: '645762497574',
    appId: '1:645762497574:web:f3cdb5901933111f06fae7',
    measurementId: 'G-44JYEK549M',
  },
  // firebase: {
  //   projectId: 'mobigenz-327dd',
  //   appId: '1:173379758302:web:9c01789b6f3cdc5e877a4f',
  //   storageBucket: 'mobigenz-327dd.appspot.com',
  //   locationId: 'asia-southeast1',
  //   apiKey: 'AIzaSyDkQ64NE8q7HtDNL7LX6asLXkoh4Mt-AGw',
  //   authDomain: 'mobigenz-327dd.firebaseapp.com',
  //   messagingSenderId: '173379758302',
  // },
  production: false,
  baseUrl: 'http://localhost:8080/api',
};

/*npm install -g firebase-tools
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import NProgress from 'nprogress'
import Router from 'next/router'
import firebase from 'firebase/app'
import 'firebase/auth'

import './app.css'
import { AuthProvider } from '../components/authentication'

// firebase must only be initialised in client, not server:
let auth: firebase.auth.Auth
if (typeof window !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyBmao_BVprF9zU2_FFIZZDxIEvuqZ2HWus',
    authDomain: 'answerleh.firebaseapp.com',
    databaseURL: 'https://answerleh.firebaseio.com',
    projectId: 'answerleh',
    storageBucket: 'answerleh.appspot.com',
    messagingSenderId: '896806835090',
    appId: '1:896806835090:web:dd3713e71eb0343326674b',
  })
  auth = firebase.auth()
}

//TODO: loading page
//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider auth={auth}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

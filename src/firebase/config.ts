export const firebaseConfig = {
  apiKey: '<YOUR_API_KEY>',
  authDomain: '<YOUR_AUTH_DOMAIN>',
  projectId: '<YOUR_PROJECT_ID>',
  storageBucket: '<YOUR_STORAGE_BUCKET>',
  messagingSenderId: '<YOUR_MESSAGING_SENDER_ID>',
  appId: '<YOUR_APP_ID>',
};

export const isFirebaseConfigured = firebaseConfig.apiKey !== '<YOUR_API_KEY>' && firebaseConfig.projectId !== '<YOUR_PROJECT_ID>' && firebaseConfig.appId !== '<YOUR_APP_ID>';

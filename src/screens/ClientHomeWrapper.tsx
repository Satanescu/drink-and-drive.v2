import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ClientHome } from './ClientHome';

const API_KEY = 'AIzaSyA-B-FQ1h6dPN1jDESTmM291xMD55QfLCo';

export const ClientHomeWrapper: React.FC = () => {
  return (
    <APIProvider apiKey={API_KEY}>
      <ClientHome />
    </APIProvider>
  );
};

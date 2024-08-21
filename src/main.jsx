import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {AuthProvider} from './context/AuthProvider.jsx'
import { MemberInfoProvider } from './context/MemberDetail.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AuthProvider>
    <MemberInfoProvider>
      <App />
    </MemberInfoProvider>
  </AuthProvider>
  // </React.StrictMode>
);

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}


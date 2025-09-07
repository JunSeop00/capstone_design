import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ModelVersionProvider} from "./contexts/ModelVersionContext";
import TabViewDTIApp from "./TabViewDTIApp";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ModelVersionProvider>
        {/*<App/>*/}
        <TabViewDTIApp/>
    </ModelVersionProvider>
);

reportWebVitals();

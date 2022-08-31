import React from "react";
import * as ReactDOMClient from 'react-dom/client';
import App from "./components/App";
import {store} from "./reducers"
import { Provider } from "react-redux";
    const container = document.getElementById('root');
    const root = ReactDOMClient.createRoot(container);
    root.render(
        <Provider store={store}>
            <App tab="home" />
        </Provider>
    )
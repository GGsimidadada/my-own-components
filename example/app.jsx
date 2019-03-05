import React from 'react';
import ReactDOM from 'react-dom';
import { OTimeline } from 'react-go-cpt';
import { TESTDATA } from './constants';

ReactDOM.render(
    <OTimeline data = { TESTDATA } />,
    document.getElementById('root'),
);
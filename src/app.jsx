import React from 'react';
import ReactDOM from 'react-dom';
import { OTimeline } from './component';
import { TESTDATA } from './constants';

ReactDOM.render(
    <OTimeline data = { TESTDATA } />,
    document.getElementById('root'),
);
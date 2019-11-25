
import { StyleAlias } from './var';

const InitialVars = {
  chrome: {
    textColor: 'white',
    backgroundColor: '#28292D',
    target: '#1CA6FC',
  },
  footer: {
    textColor: '#CCC',
    activeTextColor: 'white',
    backgroundColor: '#005FAF',
    activeBackgroundColor: '#1C82C6',
    alternateBackgroundColor: '#005FAF',
    borderColor: '#555',
    activeBorderColor: 'white',
    error: '#F44336',
    warning: '#FFEB3B',
  },
  rulers: {
    size: 15,
    backgroundColor: new StyleAlias('chrome.backgroundColor'),
    textColor: new StyleAlias('chrome.textColor'),
    lineColor: new StyleAlias('chrome.textColor'),
    markerColor: new StyleAlias('chrome.target'),
  },
  catalog: {
    item: {
      backgroundColor: '#f7f7f9',
    },
    'item#hover': {
      backgroundColor: new StyleAlias('chrome.target'),
    }
  },

};

export default InitialVars;

import React from 'react';
import PropTypes from 'prop-types';
import {MdArrowBack as Arrow} from 'react-icons/md';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

function CatalogBreadcrumb ({ styles, names }) {

  let labelNames = names.map((name, ind) => {

    let lastElement = ind === names.length - 1;
    const textStyle = styles.compile('text', lastElement && '#last');

    return <div key={ind} style={{ display: 'flex' }}>
        <div style={textStyle} onClick={name.action || null}>{name.name}</div>
        { !lastElement ? <Arrow style={styles.tab} /> : null }
    </div>
  });

  return <div style={styles.root}>{labelNames}</div>;
}

CatalogBreadcrumb.styles = {
  root: {
    margin: '1.5em',
    display: 'flex',
  },

  text: {
    fontSize: '20px',
    cursor: 'pointer',
  },

  'text#last': {
    fontWeight:'bolder',
    color: new StyleAlias('chrome.target'),
  },

  tab: {
    fill: new StyleAlias('catalog.textColor'),
    fontSize: '24px',
    marginLeft: '10px',
    marginRight: '10px',
  }
}

CatalogBreadcrumb.propTypes = {
  names: PropTypes.arrayOf(PropTypes.object).isRequired,
  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(CatalogBreadcrumb);

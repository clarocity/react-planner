import React from 'react';
import PropTypes from 'prop-types';

import Item from './item-attributes-editor';
import Line from './line-attributes-editor';
import Hole from './hole-attributes-editor';

export {
  Item,
  Line,
  Hole,
}

export default function AttributesEditor({element, ...rest}) {

  switch (element.prototype) {
  case 'items':
    return <Item
            element={element}
            {...rest}
          />;
  case 'lines':
    return <Line
            element={element}
            {...rest}
          />;
  case 'holes':
    return <Hole
            element={element}
            {...rest}
          />;
  case 'areas':
    return null;
  }

  return null;
}

AttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
};

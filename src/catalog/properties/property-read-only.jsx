import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel } from '../../components/style/export';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge} from '../../themekit';

function PropertyReadOnly({styles, value, configs}) {
  return (
    <div style={styles.root} className="PropertyToggle">
      <div style={styles.label}><FormLabel style={{marginBottom: null}}>{configs.label}</FormLabel></div>
      <div style={styles.input}>
        {value}
      </div>
    </div>
  );
}

PropertyReadOnly.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: new StyleMerge('sidebar.property.label'),
  input: new StyleMerge('sidebar.property.mainInput'),
}

PropertyReadOnly.propTypes = {
  value: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(PropertyReadOnly);

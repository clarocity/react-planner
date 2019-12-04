import React from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge, StyleAlias} from '../../themekit';

function PropertyCheckbox({styles, value, onUpdate, configs, sourceElement, internalState, state}) {

  let update = (val) => {

    if (configs.hook) {
      return configs.hook(val, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(val);
  };

  return (
    <div style={styles.root} className="PropertyCheckbox">
      <label style={styles.label}>
        <span style={styles.labelSpan}>{configs.label}</span>
        <input style={styles.checkbox} type="checkbox" checked={value} onChange={() => update(!value)}/>
      </label>
    </div>
  );
}

PropertyCheckbox.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  labelSpan: {
    display: 'block',
    width: new StyleAlias('sidebar.property.label.width'),
  },
  checkbox: {
    margin: 0,
  }
}

PropertyCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(PropertyCheckbox);

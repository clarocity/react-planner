import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Map, fromJS} from 'immutable';
import { ContextPropTypes, needsContext } from '../../context';

export default
@needsContext('catalog', 'translator', 'actions', 'state')
class PropertiesEditor extends Component {

  compute () {
    const { element, catalog } = this.props;
    let catalogElement = catalog.getElement(element.type);

    let mapped = {};
    for (let name in catalogElement.properties) {
      mapped[name] = new Map({
        currentValue: element.properties.has(name) ? element.properties.get(name) : fromJS(catalogElement.properties[name].defaultValue),
        configs: catalogElement.properties[name]
      });
    }

    return new Map(mapped);
  }

  update (key, value) {
    let properties = this.compute().map(data => data.get('currentValue'));

    properties = properties.set(key, value);

    this.props.actions.project.setProperties(properties);
  }

  render () {
    const { element, catalog, state } = this.props;
    const properties = this.compute();

    return (
      <Fragment>
        {properties.entrySeq()
          .map(([propertyName, data]) => {

            let currentValue = data.get('currentValue'), configs = data.get('configs');

            let {Editor} = catalog.getPropertyType(configs.type);

            return <Editor
              key={propertyName}
              propertyName={propertyName}
              value={currentValue}
              configs={configs}
              onUpdate={value => this.update(propertyName, value)}
              state={state}
              sourceElement={element}
            />
          })
        }
      </Fragment>
    );
  }
}

PropertiesEditor.propTypes = {
  element: PropTypes.object.isRequired,

  state: ContextPropTypes.state,
  catalog: ContextPropTypes.catalog,
  translator: ContextPropTypes.translator,
  actions: ContextPropTypes.actions
};

import React, { Component } from 'react';
import Panel from './panel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaTrash, FaTimes } from 'react-icons/fa';
import { FormNumberInput } from '../../components/style/export';
import { ContextPropTypes, needsContext } from '../context';

const tabStyle = { padding: '1em' };

const iconStyle = {
  fontSize: '14px',
  padding: '2px',
  cursor: 'pointer'
};

const addGuideStyle = {
  cursor: 'pointer',
  height: '2em'
};

const tableTabStyle = {
  width: '100%',
  textAlign: 'center'
};

export default @needsContext('state', 'actions', 'translator') class PanelGuides extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addHGVisible: true,
      addVGVisible: true,
      addCGVisible: true
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.addHGVisible !== nextState.addHGVisible ||
      this.state.addVGVisible !== nextState.addVGVisible ||
      this.state.addCGVisible !== nextState.addCGVisible ||
      this.props.state.getIn(['scene', 'guides']).hashCode() !==
        nextProps.state.getIn(['scene', 'guides']).hashCode()
    );
  }

  render() {
    let { state, actions, translator } = this.props;
    let { guides } = state.scene;

    return (
      <Panel name={translator.t('Guides')}>
        <Tabs id='guidesTabs' style={tabStyle}>
          <TabList>
            <Tab>{translator.t('Horizontal')}</Tab>
            <Tab>{translator.t('Vertical')}</Tab>
            {/*<Tab>{translator.t('Circular')}</Tab>*/}
          </TabList>

          <TabPanel>
            <table style={tableTabStyle}>
              <tbody>
                {guides
                  .get('horizontal')
                  .entrySeq()
                  .map(([hgKey, hgVal], ind) => {
                    return (
                      <tr key={hgKey}>
                        <td style={{ width: '2em' }}>{ind + 1}</td>
                        <td>{hgVal}</td>
                        <td style={{ width: '5em' }}>
                          {/*<FaPencil style={iconStyle} />*/}
                          <FaTrash
                            style={iconStyle}
                            onClick={() =>
                              actions.project.removeHorizontalGuide(hgKey)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                {this.state.addHGVisible ? (
                  <tr>
                    <td
                      colSpan='3'
                      style={addGuideStyle}
                      onClick={() => this.setState({ addHGVisible: false })}
                    >
                      {translator.t('+ Add Horizontal Giude')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan='2'>
                      <FormNumberInput
                        value={0}
                        onChange={(e) => {
                          actions.project.addHorizontalGuide(e.target.value);
                          return this.setState({ addHGVisible: true });
                        }}
                        min={0}
                        max={state.getIn(['scene', 'height'])}
                      />
                    </td>
                    <td>
                      <FaTimes
                        style={iconStyle}
                        onClick={() => this.setState({ addHGVisible: true })}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <table style={tableTabStyle}>
              <tbody>
                {guides
                  .get('vertical')
                  .entrySeq()
                  .map(([hgKey, hgVal], ind) => {
                    return (
                      <tr key={hgKey}>
                        <td style={{ width: '2em' }}>{ind + 1}</td>
                        <td>{hgVal}</td>
                        <td style={{ width: '5em' }}>
                          {/*<FaPencil style={iconStyle} />*/}
                          <FaTrash
                            style={iconStyle}
                            onClick={() =>
                              actions.project.removeVerticalGuide(hgKey)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                {this.state.addVGVisible ? (
                  <tr>
                    <td
                      colSpan='3'
                      style={addGuideStyle}
                      onClick={() => this.setState({ addVGVisible: false })}
                    >
                      {translator.t('+ Add Vertical Giude')}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan='2'>
                      <FormNumberInput
                        value={0}
                        onChange={(e) => {
                          actions.project.addVerticalGuide(e.target.value);
                          return this.setState({ addVGVisible: true });
                        }}
                        min={0}
                        max={state.getIn(['scene', 'height'])}
                      />
                    </td>
                    <td>
                      <FaTimes
                        style={iconStyle}
                        onClick={() => this.setState({ addVGVisible: true })}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TabPanel>
          {/*<TabPanel>
            <b>TODO Circular Giudes</b>
          </TabPanel>*/}
        </Tabs>
      </Panel>
    );
  }
}

PanelGuides.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
};

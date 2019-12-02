import React, {Component} from 'react';
import {
  ContentTitle,
  ContentContainer,
  FormLabel,
  FormBlock,
  FormNumberInput,
  FormSubmitButton,
  CancelButton
} from '../style/export';
import { ContextPropTypes, needsContext } from '../context';

export default
@needsContext('translator','actions','state')
class ProjectConfigurator extends Component {

  constructor(props) {
    super(props);

    let scene = props.state.scene;

    this.state = {
      dataWidth: scene.width,
      dataHeight: scene.height,
    };
  }

  onSubmit(event) {
    event.preventDefault();

    let {dataWidth, dataHeight} = this.state;
    dataWidth = parseInt(dataWidth);
    dataHeight = parseInt(dataHeight);
    if (dataWidth <= 100 || dataHeight <= 100) {
      alert('Scene size too small');
    } else {
      this.props.actions.project.setProjectProperties({width: dataWidth, height: dataHeight});
    }
  }


  render() {
    let {actions, translator} = this.props;
    let {dataWidth, dataHeight} = this.state;

    return (
      <ContentContainer>
        <ContentTitle>{translator.t('Project config')}</ContentTitle>

        <form onSubmit={e => this.onSubmit(e)}>
          <FormBlock>
            <FormLabel htmlFor='width'>{translator.t('width')}</FormLabel>
            <FormNumberInput
              id='width'
              placeholder='width'
              value={dataWidth}
              onChange={e => this.setState({dataWidth: e.target.value})}
            />
          </FormBlock>

          <FormBlock>
            <FormLabel htmlFor='height'>{translator.t('height')}</FormLabel>
            <FormNumberInput
              id='height'
              placeholder='height'
              value={dataHeight}
              onChange={e => this.setState({dataHeight: e.target.value})}
            />
          </FormBlock>

          <table style={{float: 'right'}}>
            <tbody>
            <tr>
              <td>
                <CancelButton
                  size='large'
                  onClick={() => actions.project.rollback()}
                >{translator.t('Cancel')}</CancelButton>
              </td>
              <td>
                <FormSubmitButton size='large'>{translator.t('Save')}</FormSubmitButton>
              </td>
            </tr>
            </tbody>
          </table>
        </form>
      </ContentContainer>
    )
  }
}

ProjectConfigurator.propTypes = {
  translator: ContextPropTypes.translator,
  actions: ContextPropTypes.actions,
  state: ContextPropTypes.state,
};

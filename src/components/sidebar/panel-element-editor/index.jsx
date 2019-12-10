import React from 'react';
import Panel from '../panel';
import AttributesEditor from './attributes-editor';
import PropertiesEditor from './properties-editor'
import PropertiesClipboard from './properties-clipboard';
import {Seq} from 'immutable';
import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../../constants';
import { ContextPropTypes, needsContext } from '../../context';
import {BorderStyle} from '../../../themekit';


function PanelElementEditor({styles, state, translator}) {

  let {scene, mode} = state;

  if (![MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN,
      MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
      MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM,
      MODE_DRAGGING_LINE, MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE,
      MODE_ROTATING_ITEM, MODE_UPLOADING_IMAGE, MODE_FITTING_IMAGE].includes(mode)) return null;


  let layers = scene.layers.valueSeq().map(
    (layer) => Seq()
      .concat(layer.lines, layer.holes, layer.areas, layer.items)
      .filter(element => element.selected)
      .map(element => (
        <Panel key={element.id} name={translator.t('Properties: [{0}] {1}', element.type, element.id)} opened={true}>
          <div style={{padding: '10px 15px 0'}}>
            <AttributesEditor
              element={element}
              layer={layer}
            />
            <div style={styles.divider} />
            <PropertiesEditor element={element} />
            <PropertiesClipboard element={element} />
          </div>
        </Panel>
      ))
      .valueSeq()
  );

  return <div className='PanelElementEditor'>{layers}</div>

}

PanelElementEditor.styles = {
  divider: {
    height: '1px',
    margin: '1em 0',
    borderTop: new BorderStyle({ color: '$sidebar.panel.borderTopColor'}),
    borderBottom: new BorderStyle({ color: '$sidebar.panel.borderBottomColor'})
  },
}

PanelElementEditor.propTypes = {
  styles: ContextPropTypes.styles,
  state: ContextPropTypes.state,
  translator: ContextPropTypes.translator,
};

export default needsContext('styles', 'state', 'translator')(PanelElementEditor);

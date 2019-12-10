import Panel from './panel';
import PanelElementEditor from './panel-element-editor';
import PanelGroupEditor from './panel-group-editor';
import PanelLayers from './panel-layers';
import PanelGuides from './panel-guides';
import PanelGroups from './panel-groups';
import PanelLayerElements from './panel-layer-elements';

export const defaultPanels = [
  PanelGuides,
  PanelLayers,
  PanelLayerElements,
  PanelGroups,
  PanelGroupEditor,
  PanelElementEditor,
];

export default {
  Panel,
  Elements:      PanelElementEditor,
  Layers:        PanelLayers,
  LayerElements: PanelLayerElements,
  Guides:        PanelGuides,
  Groups:        PanelGroups,
  GroupEditor:   PanelGroupEditor,
  defaultPanels,
}

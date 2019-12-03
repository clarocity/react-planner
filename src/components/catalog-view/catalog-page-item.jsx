 import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MdNavigateNext} from 'react-icons/md';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, BorderStyle} from '../../themekit';

export default @needsContext('actions', 'styles') class CatalogPageItem extends Component {

  static styles = {
    root: {
      width: '14em',
      height: '14em',
      padding: '0.625em',
      backgroundColor: new StyleAlias('catalog.item.backgroundColor'),
      border: new BorderStyle({ color: '$catalog.item.borderColor' }),
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
      borderRadius: '2px',
      transition: 'backgroundColor .2s ease-in-out',
      alignSelf: 'center',
      justifySelf: 'center',

      '#hover': {
        backgroundColor: new StyleAlias('catalog.item.backgroundHover'),
        color: new StyleAlias('catalog.item.backgroundHover'),
      },
    },

    title: {
      textTransform: 'capitalize',
      transition: 'all .15s ease-in-out',

      '#hover': {
        fontSize: '1.4em',
      },
    },

    glyph: {
      fontSize: '5em',
      margin: '0 -10%',
    },

    wrap: {
      background: new StyleAlias('catalog.backgroundColor'),
      marginBottom: '5px',
      border: new BorderStyle({ color: '$catalog.borderColor' }),
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }

  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  changePage = () => {
    this.props.actions.project.changeCatalogPage(this.props.page.name, this.props.oldPage.name)
  }

  onMouseEnter = () => this.setState({hover: true})
  onMouseLeave  = () => this.setState({hover: false})

  render() {
    const { page, styles } = this.props;
    let hover = this.state.hover;

    return (
      <div
        style={styles.compile('root', hover && '#hover')}
        onClick={this.changePage}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div style={styles.wrap}>
          <b style={styles.compile('title', hover && '#hover')}>{page.label}</b>
          <MdNavigateNext style={styles.compile('glyph', hover && '#hover')}/>
        </div>

      </div>
    );
  }
}

CatalogPageItem.propTypes = {
  page: PropTypes.object.isRequired,
  oldPage: PropTypes.object.isRequired,
  actions: ContextPropTypes.actions,
  styles: ContextPropTypes.styles,
};

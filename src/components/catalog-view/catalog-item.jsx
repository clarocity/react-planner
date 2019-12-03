import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FaPlusCircle as IconAdd} from 'react-icons/fa';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, BorderStyle} from '../../themekit';

export default @needsContext('actions', 'styles') class CatalogItem extends Component {

  static styles = {
    root: {
      width: '14em',
      height: '14em',
      padding: '0.625em',
      background: new StyleAlias('catalog.item.backgroundColor'),
      border: new BorderStyle({ color: '$catalog.item.borderColor' }),
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
      borderRadius: '2px',
      transition: 'all .15s ease-in-out',
      WebkitTransition: 'all .15s ease-in-out',
      alignSelf: 'center',
      justifySelf: 'center',

      '#hover': {
        background: new StyleAlias('catalog.item.backgroundHover'),
      }
    },

    title: {
      width:'100%',
      textAlign:'center',
      display:'block',
      marginBottom:'.5em',
      textTransform: 'capitalize',

      '#hover': {
        color: '#FFF',
      },
    },

    imageContainer: {
      width: '100%',
      height: '8em',
      position:'relative',
      overflow:'hidden',
      border: new BorderStyle({ color: '$catalog.item.imageBorder' }),
      backgroundColor: new StyleAlias('catalog.item.imageBackground'),
      padding:0,
      margin:0,
      marginBottom: '5px',
    },

    image: {
      position:'absolute',
      width: '100%',
      height: '100%',
      background: new StyleAlias('catalog.item.imageBackground'),
      backgroundSize: 'contain',
      backgroundPosition:'center center',
      backgroundRepeat:'no-repeat',
      transition: 'all .2s ease-in-out',

      '#hover': {
        transform: 'scale(1.2)',
      },
    },

    plus: {
      marginTop:'1.5em',
      color: new StyleAlias('catalog.item.backgroundHover'),
      fontSize: '2em',
      opacity: '0.7',
      width: '100%'
    },

    description: {
      display: 'block',
      height: '2em',
      margin: '0 auto',
      fontSize: '0.75em',
      fontStyle:'italic',
      lineHeight: '1em',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    tags: {
      listStyle: 'none',
      margin: '0px',
      padding: '0px',
      fontSize: '11px',
      marginBottom: '3px',
    },

    tag: {
      display: 'inline-block',
      backgroundColor: new StyleAlias('catalog.tag.backgroundColor'),
      color: new StyleAlias('catalog.tag.textColor'),
      padding: '1px 4px',
      marginRight: '3px',
      borderRadius: '3px'
    }
  }

  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  select() {
    const { element, actions } = this.props;

    switch (element.prototype) {
      case 'lines':
        actions.lines.selectToolDrawingLine(element.name);
        break;
      case 'items':
        actions.items.selectToolDrawingItem(element.name);
        break;
      case 'holes':
        actions.holes.selectToolDrawingHole(element.name);
        break;
    }

    actions.project.pushLastSelectedCatalogElementToHistory(element);
  }

  onMouseEnter = () => this.setState({hover: true})
  onMouseLeave = () => this.setState({hover: false})

  render() {
    const { styles, element } = this.props;

    let hover = this.state.hover;

    return (
      <div
        style={styles.compile('root', hover && '#hover')}
        onClick={() => this.select()}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <b style={ styles.compile('title', hover && '#hover') }>{element.info.title}</b>
        <div style={ styles.imageContainer }>
          <div style={styles.compile('image', hover && '#hover', {backgroundImage: 'url(' + element.info.image + ')'})}>
            { hover ? <IconAdd style={styles.plus} /> : null }
          </div>
        </div>
        <ul style={styles.tags}>
          {element.info.tag.map((tag, index) => <li style={styles.tag} key={index}>{tag}</li>)}
        </ul>
        <div style={styles.description}>{element.info.description}</div>
      </div>
    );
  }
}

CatalogItem.propTypes = {
  element: PropTypes.object.isRequired,
  actions: ContextPropTypes.actions,
  styles: ContextPropTypes.styles,
};

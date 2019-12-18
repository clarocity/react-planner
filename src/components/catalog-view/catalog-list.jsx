import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CatalogItem from './catalog-item';
import CatalogBreadcrumb from './catalog-breadcrumb';
import CatalogPageItem from './catalog-page-item';
import CatalogTurnBackPageItem from './catalog-turn-back-page-item';
import ContentContainer from '../style/content-container';
import ContentTitle from '../style/content-title';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, BorderStyle} from '../../themekit';

export default
@needsContext('styles', 'state', 'translator', 'catalog', 'actions')
class CatalogList extends Component {

  static styles = {
    root: {
      backgroundColor: new StyleAlias('catalog.backgroundColor'),
      color: new StyleAlias('catalog.textColor'),
      padding:'1em',
      overflowY:'auto',
      overflowX:'hidden',
      zIndex:10
    },

    items: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(14em, 1fr))',
      gridGap: '10px',
      marginTop: '1em'
    },

    listContainer: {
      width: '100%',
      height: '3em',
      padding: '0.625em',
      background: new StyleAlias('catalog.item.backgroundColor'),
      border: new BorderStyle({ color: '$catalog.item.borderColor' }),
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
      borderRadius: '2px',
      transition: 'all .2s ease-in-out',
      WebkitTransition: 'all .2s ease-in-out',
      marginBottom: '1em',
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',

      '#history': {
        padding: '0.2em 0.625em'
      }
    },

    searchText: {
      width: '8em',
    },

    searchInput: {
      flex: '1',
      margin: '0',
      padding: '0 1em',
      border: new BorderStyle({ color: '$catalog.borderColor' }),
      height: '3em',
    },

    historyElement: {
      width: 'auto',
      height: '2em',
      lineHeight: '2em',
      textAlign:'center',
      borderRadius: '1em',
      display: 'inline-block',
      cursor: 'pointer',
      backgroundColor: new StyleAlias('chrome.backgroundColor'),
      color: new StyleAlias('chrome.textColor'),
      textTransform: 'capitalize',
      margin: '0.25em',
      padding: '0 1em'
    }
  }

  constructor(props) {
    super(props);

    let page = props.state.catalog.page;
    let currentCategory = props.catalog.getCategory(page);
    let elementsToDisplay = currentCategory.elements.filter(element => element.info.visibility ? element.info.visibility.catalog : true );

    this.state = {
      categories: currentCategory.categories,
      elements: elementsToDisplay,
      matchString: '',
      matchedElements: []
    };
  }

  flattenCategories( categories ) {
    let toRet = [];

    for( let x = 0; x < categories.length; x++ )
    {
      let curr = categories[x];
      toRet = toRet.concat( curr.elements );
      if( curr.categories.length ) toRet = toRet.concat( this.flattenCategories ( curr.categories ) );
    }

    return toRet;
  }

  matcharray( text ) {

    let array = this.state.elements.concat( this.flattenCategories( this.state.categories ) );

    let filtered = [];

    if( text != '' ) {
      let regexp = new RegExp( text, 'i');
      for (let i = 0; i < array.length; i++) {
        if (regexp.test(array[i].info.title)) {
          filtered.push(array[i]);
        }
      }
    }

    this.setState({
      matchString: text,
      matchedElements: filtered
    });
  }

  select( element ) {
    const {actions} = this.props;

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

  render() {
    const {style, styles, state, catalog, actions, translator} = this.props;
    let page = state.catalog.page;
    let currentCategory = catalog.getCategory(page);
    let categoriesToDisplay = currentCategory.categories;
    let elementsToDisplay = currentCategory.elements.filter(element => element.info.visibility ? element.info.visibility.catalog : true );

    let breadcrumbComponent = null;

    if (page !== 'root') {

      let breadcrumbsNames = [];

      state.catalog.path.forEach(pathName => {
        breadcrumbsNames.push({
          name: catalog.getCategory(pathName).label,
          action: () => actions.project.goBackToCatalogPage(pathName)
        });
      });

      breadcrumbsNames.push({name: currentCategory.label, action: ''});

      breadcrumbComponent = (<CatalogBreadcrumb names={breadcrumbsNames}/>);
    }

    let pathSize = state.catalog.path.size;

    let turnBackButton = pathSize > 0 ? (
      <CatalogTurnBackPageItem key={pathSize} page={catalog.categories[state.catalog.path.get(pathSize - 1)]}/>) : null;


    let selectedHistory = state.get('selectedElementsHistory');
    let selectedHistoryElements = selectedHistory.map( ( el, ind ) =>
      <div key={ind} style={styles.historyElement} title={el.name} onClick={() => this.select(el) }>{el.name}</div>
    );

    return (
      <ContentContainer style={styles.compile('root', style)}>
        <ContentTitle>{translator.t('Catalog')}</ContentTitle>
        {breadcrumbComponent}
        <div style={styles.listContainer}>
          <span style={styles.searchText}>{translator.t('Search Element')}</span>
          <input type="text" style={styles.searchInput} onChange={( e ) => { this.matcharray( e.target.value ); } }/>
        </div>
        { selectedHistory.size ?
          <div style={styles.listContainer}>
            <span style={styles.searchText}>{translator.t('Last Selected')}</span>
            {selectedHistoryElements}
          </div> :
          null
        }
        <div style={styles.items}>
          {
            this.state.matchString === '' ? [
              turnBackButton,
              categoriesToDisplay.map(cat => <CatalogPageItem key={cat.name} page={cat} oldPage={currentCategory}/>),
              elementsToDisplay.map(elem => <CatalogItem key={elem.name} element={elem}/>)
            ] :
            this.state.matchedElements.map(elem => <CatalogItem key={elem.name} element={elem}/>)
          }
        </div>
      </ContentContainer>
    )
  }
}

CatalogList.propTypes = {
  style: PropTypes.object,

  styles: ContextPropTypes.styles,
  state: ContextPropTypes.state,
  translator: ContextPropTypes.translator,
  catalog: ContextPropTypes.catalog,
  actions: ContextPropTypes.actions,
};

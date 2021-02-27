/*
react-json-table-v2 v0.1.5
https://github.com/Amedeo91/react-json-table
MIT: https://github.com/Amedeo91/react-json-table/raw/master/LICENSE
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require(undefined));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["JsonTable"] = factory(require(undefined));
	else
		root["JsonTable"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);

	React.DOM = __webpack_require__(2);


	// Some shared attrs for JsonTable and JsonRow
	let defaultSettings = {
	    header: true,
	    noRowsMessage: 'No items',
	    classPrefix: 'json'
	  },
	  getSetting = function( name, $this ){
	    const settings = $this.props.settings;

	    if( !settings || typeof settings[ name ] === 'undefined' )
	      return defaultSettings[ name ];

	    return settings[ name ];
	  }
	;

	class JsonTable extends React.Component{
	  constructor (props){
	    super(props);
	    this.onClickRow = this.onClickRow.bind(this);
	    this.onClickCell = this.onClickCell.bind(this);
	    this.onClickHeader = this.onClickCell.bind(this);
	  }

	  getSetting(name){
	    return getSetting(name, this)
	  };

	  render() {
	    const cols = this.normalizeColumns(),
	      contents = [this.renderRows( cols )]
	    ;

	    if( this.getSetting('header') )
	      contents.unshift( this.renderHeader( cols ) );

	    const tableClass = this.props.className || this.getSetting( 'classPrefix' ) + 'Table';

	    return React.DOM.table({ className: tableClass }, contents );
	  }

	  renderHeader( cols ) {
	    const me = this,
	      prefix = this.getSetting( 'classPrefix' ),
	      headerClass = this.getSetting( 'headerClass' ),
	      cells = cols.map( function(col){
	        let className = prefix + 'Column';
	        if( headerClass )
	          className = headerClass( className, col.key );

	        return React.DOM.th(
	          { className: className, key: col.key, onClick: me.onClickHeader, "data-key": col.key },
	          col.label
	        );
	      })
	    ;

	    return React.DOM.thead({ key: 'th' },
	      React.DOM.tr({ className: prefix + 'Header' }, cells )
	    );
	  }

	  renderRows( cols ) {
	    let me = this,
	      items = this.props.rows,
	      settings = this.props.settings || {},
	      i = 1
	    ;

	    if( !items || !items.length )
	      return React.DOM.tbody({key:'body'}, [React.DOM.tr({key:'row'}, React.DOM.td({key:'column'}, this.getSetting('noRowsMessage') ))]);

	    const rows = items.map( function( item ){
	      const key = me.getKey( item, i );
	      return React.createElement(Row, {
	        key: key,
	        reactKey: key,
	        item: item,
	        settings: settings,
	        columns: cols,
	        i: i++,
	        onClickRow: me.onClickRow,
	        onClickCell: me.onClickCell
	      });
	    });

	    return React.DOM.tbody({key:'body'}, rows);
	  }

	  getItemField( item, field ){
	    return item[ field ];
	  }

	  normalizeColumns() {
	    const getItemField = this.props.cellRenderer || this.getItemField,
	      cols = this.props.columns,
	      items = this.props.rows
	    ;

	    if( !cols ){
	      if( !items || !items.length )
	        return [];

	      return Object.keys( items[0] ).map( function( key ){
	        return { key: key, label: key, cell: getItemField };
	      });
	    }

	    return cols.map( function( col ){
	      let key;
	      if( typeof col == 'string' ){
	        return {
	          key: col,
	          label: col,
	          cell: getItemField
	        };
	      }

	      if( typeof col == 'object' ){
	        key = col.key || col.label;

	        // This is about get default column definition
	        // we use label as key if not defined
	        // we use key as label if not defined
	        // we use getItemField as cell function if not defined
	        return {
	          key: key,
	          label: col.label || key,
	          cell: col.cell || getItemField
	        };
	      }

	      return {
	        key: 'unknown',
	        name:'unknown',
	        cell: 'Unknown'
	      };
	    });
	  }

	  getKey( item, i ) {
	    const field = this.props.settings && this.props.settings.keyField;
	    if( field && item[ field ] )
	      return item[ field ];

	    if( item.id )
	      return item.id;

	    if( item._id )
	      return item._id;

	    return i;
	  }

	  shouldComponentUpdate(){
	    return true;
	  }

	  onClickRow( e, item ){
	    if( this.props.onClickRow ){
	      this.props.onClickRow( e, item );
	    }
	  }

	  onClickHeader( e ){
	    if( this.props.onClickHeader ){
	      this.props.onClickHeader( e, e.target.dataset.key );
	    }
	  }

	  onClickCell( e, key, item ){
	    if( this.props.onClickCell ){
	      this.props.onClickCell( e, key, item );
	    }
	  }
	}

	class Row extends React.Component{

	  constructor (props){
	    super(props);
	    this.onClickRow = this.onClickRow.bind(this);
	    this.onClickCell = this.onClickCell.bind(this);
	  }

	  getSetting(name){
	    return getSetting(name, this)
	  };

	  render() {
	    const me = this,
	      props = this.props,
	      cellClass = this.getSetting('cellClass'),
	      rowClass = this.getSetting('rowClass'),
	      prefix = this.getSetting('classPrefix'),
	      cells = props.columns.map( function( col ){
	        let content = col.cell,
	          key = col.key,
	          className = prefix + 'Cell ' + prefix + 'Cell_' + key
	        ;

	        if( cellClass )
	          className = cellClass( className, key, props.item );

	        if( typeof content === 'function' )
	          content = content( props.item, key );

	        return React.DOM.td( {
	          className: className,
	          key: key,
	          "data-key": key,
	          onClick: me.onClickCell
	        }, content );
	      })
	    ;

	    let className = prefix + 'Row ' + prefix +
	      (props.i % 2 ? 'Odd' : 'Even')
	    ;

	    if( props.reactKey )
	      className += ' ' + prefix + 'Row_' + props.reactKey;

	    if( rowClass )
	      className = rowClass( className, props.item );

	    return React.DOM.tr({
	      className: className,
	      onClick: me.onClickRow,
	      key: this.props.reactKey
	    }, cells );
	  };

	  onClickCell(e) {
	    this.props.onClickCell( e, e.target.dataset.key, this.props.item );
	  };

	  onClickRow(e) {
	    this.props.onClickRow( e, this.props.item );
	  };
	}

	module.exports = JsonTable;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Copyright (c) 2015-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function(f) {
	  if (true) {
	    module.exports = f(__webpack_require__(1));
	    /* global define */
	  } else if (typeof define === 'function' && define.amd) {
	    define(['react'], f);
	  } else {
	    var g;
	    if (typeof window !== 'undefined') {
	      g = window;
	    } else if (typeof global !== 'undefined') {
	      g = global;
	    } else if (typeof self !== 'undefined') {
	      g = self;
	    } else {
	      g = this;
	    }

	    if (typeof g.React === 'undefined') {
	      throw Error('React module should be required before ReactDOMFactories');
	    }

	    g.ReactDOMFactories = f(g.React);
	  }
	})(function(React) {
	  /**
	   * Create a factory that creates HTML tag elements.
	   */
	  function createDOMFactory(type) {
	    var factory = React.createElement.bind(null, type);
	    // Expose the type on the factory and the prototype so that it can be
	    // easily accessed on elements. E.g. `<Foo />.type === Foo`.
	    // This should not be named `constructor` since this may not be the function
	    // that created the element, and it may not even be a constructor.
	    factory.type = type;
	    return factory;
	  };

	  /**
	   * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
	   */
	  var ReactDOMFactories = {
	    a: createDOMFactory('a'),
	    abbr: createDOMFactory('abbr'),
	    address: createDOMFactory('address'),
	    area: createDOMFactory('area'),
	    article: createDOMFactory('article'),
	    aside: createDOMFactory('aside'),
	    audio: createDOMFactory('audio'),
	    b: createDOMFactory('b'),
	    base: createDOMFactory('base'),
	    bdi: createDOMFactory('bdi'),
	    bdo: createDOMFactory('bdo'),
	    big: createDOMFactory('big'),
	    blockquote: createDOMFactory('blockquote'),
	    body: createDOMFactory('body'),
	    br: createDOMFactory('br'),
	    button: createDOMFactory('button'),
	    canvas: createDOMFactory('canvas'),
	    caption: createDOMFactory('caption'),
	    cite: createDOMFactory('cite'),
	    code: createDOMFactory('code'),
	    col: createDOMFactory('col'),
	    colgroup: createDOMFactory('colgroup'),
	    data: createDOMFactory('data'),
	    datalist: createDOMFactory('datalist'),
	    dd: createDOMFactory('dd'),
	    del: createDOMFactory('del'),
	    details: createDOMFactory('details'),
	    dfn: createDOMFactory('dfn'),
	    dialog: createDOMFactory('dialog'),
	    div: createDOMFactory('div'),
	    dl: createDOMFactory('dl'),
	    dt: createDOMFactory('dt'),
	    em: createDOMFactory('em'),
	    embed: createDOMFactory('embed'),
	    fieldset: createDOMFactory('fieldset'),
	    figcaption: createDOMFactory('figcaption'),
	    figure: createDOMFactory('figure'),
	    footer: createDOMFactory('footer'),
	    form: createDOMFactory('form'),
	    h1: createDOMFactory('h1'),
	    h2: createDOMFactory('h2'),
	    h3: createDOMFactory('h3'),
	    h4: createDOMFactory('h4'),
	    h5: createDOMFactory('h5'),
	    h6: createDOMFactory('h6'),
	    head: createDOMFactory('head'),
	    header: createDOMFactory('header'),
	    hgroup: createDOMFactory('hgroup'),
	    hr: createDOMFactory('hr'),
	    html: createDOMFactory('html'),
	    i: createDOMFactory('i'),
	    iframe: createDOMFactory('iframe'),
	    img: createDOMFactory('img'),
	    input: createDOMFactory('input'),
	    ins: createDOMFactory('ins'),
	    kbd: createDOMFactory('kbd'),
	    keygen: createDOMFactory('keygen'),
	    label: createDOMFactory('label'),
	    legend: createDOMFactory('legend'),
	    li: createDOMFactory('li'),
	    link: createDOMFactory('link'),
	    main: createDOMFactory('main'),
	    map: createDOMFactory('map'),
	    mark: createDOMFactory('mark'),
	    menu: createDOMFactory('menu'),
	    menuitem: createDOMFactory('menuitem'),
	    meta: createDOMFactory('meta'),
	    meter: createDOMFactory('meter'),
	    nav: createDOMFactory('nav'),
	    noscript: createDOMFactory('noscript'),
	    object: createDOMFactory('object'),
	    ol: createDOMFactory('ol'),
	    optgroup: createDOMFactory('optgroup'),
	    option: createDOMFactory('option'),
	    output: createDOMFactory('output'),
	    p: createDOMFactory('p'),
	    param: createDOMFactory('param'),
	    picture: createDOMFactory('picture'),
	    pre: createDOMFactory('pre'),
	    progress: createDOMFactory('progress'),
	    q: createDOMFactory('q'),
	    rp: createDOMFactory('rp'),
	    rt: createDOMFactory('rt'),
	    ruby: createDOMFactory('ruby'),
	    s: createDOMFactory('s'),
	    samp: createDOMFactory('samp'),
	    script: createDOMFactory('script'),
	    section: createDOMFactory('section'),
	    select: createDOMFactory('select'),
	    small: createDOMFactory('small'),
	    source: createDOMFactory('source'),
	    span: createDOMFactory('span'),
	    strong: createDOMFactory('strong'),
	    style: createDOMFactory('style'),
	    sub: createDOMFactory('sub'),
	    summary: createDOMFactory('summary'),
	    sup: createDOMFactory('sup'),
	    table: createDOMFactory('table'),
	    tbody: createDOMFactory('tbody'),
	    td: createDOMFactory('td'),
	    textarea: createDOMFactory('textarea'),
	    tfoot: createDOMFactory('tfoot'),
	    th: createDOMFactory('th'),
	    thead: createDOMFactory('thead'),
	    time: createDOMFactory('time'),
	    title: createDOMFactory('title'),
	    tr: createDOMFactory('tr'),
	    track: createDOMFactory('track'),
	    u: createDOMFactory('u'),
	    ul: createDOMFactory('ul'),
	    var: createDOMFactory('var'),
	    video: createDOMFactory('video'),
	    wbr: createDOMFactory('wbr'),

	    // SVG
	    circle: createDOMFactory('circle'),
	    clipPath: createDOMFactory('clipPath'),
	    defs: createDOMFactory('defs'),
	    ellipse: createDOMFactory('ellipse'),
	    g: createDOMFactory('g'),
	    image: createDOMFactory('image'),
	    line: createDOMFactory('line'),
	    linearGradient: createDOMFactory('linearGradient'),
	    mask: createDOMFactory('mask'),
	    path: createDOMFactory('path'),
	    pattern: createDOMFactory('pattern'),
	    polygon: createDOMFactory('polygon'),
	    polyline: createDOMFactory('polyline'),
	    radialGradient: createDOMFactory('radialGradient'),
	    rect: createDOMFactory('rect'),
	    stop: createDOMFactory('stop'),
	    svg: createDOMFactory('svg'),
	    text: createDOMFactory('text'),
	    tspan: createDOMFactory('tspan'),
	  };

	  // due to wrapper and conditionals at the top, this will either become
	  // `module.exports ReactDOMFactories` if that is available,
	  // otherwise it will be defined via `define(['react'], ReactDOMFactories)`
	  // if that is available,
	  // otherwise it will be defined as global variable.
	  return ReactDOMFactories;
	});



/***/ })
/******/ ])
});
;
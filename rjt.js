var React = require('react');

React.DOM = require('react-dom-factories');


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
    this.onClickHeader = this.onClickHeader.bind(this);
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

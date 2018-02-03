Ext.define('Alegra.view.contact.Show', {
  extend: 'Ext.window.Window',
  alias : 'widget.contactShow',
  requires: ['Ext.form.Panel','Ext.form.FieldSet'],
  title : 'Ver Contacto',
  layout: 'fit',
  autoShow: true,
  width: 350,
  iconCls: 'icon-user',
  itemId: 'modalShow',
  initComponent: function() {
    this.items = [{
      xtype: 'form',
      padding: '5 5 0 5',
      border: false,
      style: 'background-color: #fff;',
      fieldDefaults: {
        anchor: '100%',
        labelAlign: 'right',
      },
      items: [{
        xtype: 'displayfield',
        name: 'name',
        fieldLabel: 'Nombre',
      }, {
        xtype: 'displayfield',
        name: 'identification',
        fieldLabel: 'Identificación',
      }, {
        xtype: 'displayfield',
        name: 'phonePrimary',
        fieldLabel: 'Tel\u00E9fono 1',
      }, {
        xtype: 'displayfield',
        name: 'phoneSecondary',
        fieldLabel: 'Tel\u00E9fono 2',
      }, {
        xtype: 'displayfield',
        name: 'mobile',
        fieldLabel: 'Celular',
      }, {
        xtype: 'displayfield',
        name: 'address',
        fieldLabel: 'Dirección',
      }, {
        xtype: 'displayfield',
        name: 'city',
        fieldLabel: 'Ciudad',
      }, {
        xtype: 'displayfield',
        vtype: 'email',
        name: 'email',
        fieldLabel: 'Email',
      }, {
        xtype: 'displayfield',
        name: 'observations',
        fieldLabel: 'Observaciones',
      }],
    }];
    this.dockedItems = [{
      xtype: 'toolbar',
      dock: 'bottom',
      id: 'buttons',
      ui: 'footer',
      items: ['->', {
        iconCls: 'icon-close',
        text: 'Cerrar',
        scope: this,
        handler: this.close,
      }],
    }];
    this.callParent(arguments);
  },
});

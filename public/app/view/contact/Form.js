var individual = {
    xtype: 'container',
    layout: 'hbox',
    margin: '0 0 10',
    items: [{
            xtype: 'fieldset',
            flex: 1,
            title: 'Ingrese los datos',
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                hideEmptyLabel: false
            },
            items: [{
                    name: 'name',
                    fieldLabel: 'Nombre <span style="color:red">(*)</span>',
                    allowBlank: false
                },
                {
                    name: 'identification',
                    fieldLabel: 'Identificacion'
                },
                {
                    name: 'address',
                    fieldLabel: 'Dirección'
                },
                {
                    name: 'city',
                    fieldLabel: 'Ciudad'
                },
                {
                    name: 'phonePrimary',
                    fieldLabel: 'Teléfono 1',
                    emptyText: 'Ejem (0251)1234567',
                    type: Number
                },
                {
                    name: 'phoneSecondary',
                    fieldLabel: 'Teléfono 2',
                    emptyText: 'Ejem (0251)1234567',
                    type: Number
                },
                {
                    name: 'fax',
                    fieldLabel: 'Fax'
                },
                {
                    name: 'mobile',
                    fieldLabel: 'Celular',
                    emptyText: 'Ejem (000)1234567',
                    type: Number
                },
                {
                    xtype: 'combobox',
                    name: 'priceList',
                    fieldLabel: 'Lista de precios',
                    emptyText: 'Seleccione',
                    editable: false,
                    store: ['Ninguno', 'General']
                },
                {
                    xtype: 'combobox',
                    name: 'seller',
                    fieldLabel: 'Vendedor',
                    emptyText: 'Seleccione',
                    editable: false,
                },
            ]
        },
        {
            xtype: 'component',
            width: 10
        },
        {
            xtype: 'fieldset',
            flex: 1,
            title: 'Ingrese los datos',
            defaultType: 'textfield', // each item will be a radio button
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                hideEmptyLabel: false
            },
            items: [{
                    xtype: 'combo',
                    name: 'term',
                    itemId: 'contactterm',
                    fieldLabel: 'Términos de pago',
                    emptyText: 'Seleccione',
                    editable: false,
                    mode: 'remote',
                    store: ['Ninguno', 'De contado', '8 días', '15 días', '30 días', '60 días']
                },
                {
                    xtype: 'checkboxfield',
                    name: 'client',
                    itemId: 'contactclient',
                    fieldLabel: 'Cliente'
                },
                {
                    xtype: 'checkboxfield',
                    name: 'provider',
                    itemId: 'contactprovider',
                    fieldLabel: 'Proveedor'
                },
                {
                    name: 'email',
                    fieldLabel: 'E-mail',
                    vtype: 'email'
                },
                {
                    xtype: 'textareafield',
                    name: 'observations',
                    fieldLabel: 'Observación',
                    height: 132
                },
            ]
        },
        {
            xtype: 'component',
            width: 10
        },
    ]
};

Ext.define('CrudExt.view.contact.Form', {
    extend: 'Ext.form.Panel',
    autoScroll: true,
    requires: ['Ext.form.Field'],
    defaultType: 'textfield',
    defaults: {
        //allowBlank: false,
        labelAlign: 'left',
        labelWidth: 400
    },
    alias: 'widget.contactform',
    padding: 5,
    style: 'background-color: #00BFA5; ',
    border: false,
    bodyPadding: 10,

    initComponent: function() {

        this.items = [
            individual,
            Ext.create('Ext.grid.Panel', {
                title: 'Contactos Internos',
                xtype: 'inernalcontactgrid',
                itemId: 'inernalcontactgrid',
                store: 'InternalContacts',
                columns: [{
                        header: 'Nombre',
                        dataIndex: 'internal_name',
                        flex: 1,
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true
                        },
                        sortable: false,
                        align: 'center',
                        width: 100,
                    },
                    {
                        header: 'Apellido',
                        dataIndex: 'internal_lastName',
                        flex: 1,
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true
                        },
                        sortable: false,
                        align: 'center',
                    },
                    {
                        header: 'Correo',
                        dataIndex: 'internal_email',
                        flex: 1,
                        editor: {
                            vtype: 'email',
                            selectOnFocus: true
                        },
                        sortable: false,
                        align: 'center',
                    },
                    {
                        header: 'Teléfono',
                        dataIndex: 'internal_phone',
                        flex: 1,
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true
                        },
                        sortable: false
                    },
                    {
                        header: 'Celular',
                        dataIndex: 'internal_mobile',
                        flex: 1,
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true
                        },
                        sortable: false,

                    },
                    {
                        xtype: 'checkcolumn',
                        header: 'Enviar notificación',
                        dataIndex: 'internal_sendNotifications',
                        flex: 1,
                        align: 'center',
                        sortable: false,
                        renderer: function(value, meta) {
                            meta.tdAttr = 'data-qtip="Si selecciona sí, debe ingresar un correo, de lo contrario se producirá un error y no se guardará el registro"';
                            if (value === true) {
                                return 'Sí';
                            }
                            return 'No';
                        }
                    },
                    {
                        xtype: 'actioncolumn',
                        header: 'Eliminar',
                        width: '10%',
                        align: 'center',
                        items: [{
                            icon: 'https://cdn1.alegra.com/images/icons/delete.png',
                            tooltip: 'Eliminar fila',
                            handler: function(grid, rowIndex) {
                                grid.getStore().removeAt(rowIndex);
                            }
                        }],
                        sortable: false
                    },
                ],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'button',
                        text: 'Agregar',
                        action: 'addInternal',
                        handler: function(bt) {
                            var gridInternalContacts = Ext.ComponentQuery.query("#inernalcontactgrid")[0],
                                store = gridInternalContacts.getView().getStore();
                            store.add({
                                internal_name: '',
                                internal_lastName: '',
                                internal_email: '',
                                internal_phone: '',
                                internal_mobile: '',
                                internal_sendNotifications: ''
                            });
                        }
                    }, ]
                }, ],
                selType: 'cellmodel',
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,

                    })
                ],
                height: '100%',
                width: '100%',
            })
        ];

        this.bbar = [{
                text: 'Guardar',
                action: 'save',
                itemId: 'salvar',
                iconCls: 'save'
            },
            {
                text: 'Cancelar',
                action: 'cancel',
                itemId: 'cancelar',
                iconCls: 'cancel',
                handler: function() {
                    this.up('window').close();
                }
            },
        ];

        this.callParent(arguments);
    }
});
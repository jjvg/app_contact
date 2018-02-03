Ext.define('CrudExt.view.contact.Grid', {
    extend: 'Ext.grid.Panel',
    itemId: 'contactGrid',
    xtype: 'contactgrid',
    store: 'Contacts',
    stripeRows: true,
    columnLines: true,
    initComponent: function() {

        this.columns = [
            { header: 'Nombre', dataIndex: 'name', width: '20%' },
            { header: 'Identificacion', dataIndex: 'identification', width: '20%' },
            { header: 'Teléfono 1', dataIndex: 'phonePrimary', width: '20%' },
            { header: 'Observaciones', dataIndex: 'observations', width: '30%' }
        ];

        this.dockedItems = [{
                xtype: 'toolbar',

                dock: 'top',
                items: [{
                        xtype: 'button',
                        style: 'background-color : #00BFA5;',
                        text: '<span style="color:white">Agregar</span>',
                        icon: 'https://cdn1.alegra.com/images/icons/add.png',
                        action: 'add'
                    },
                    {
                        style: 'background-color : #00BFA5;',
                        text: '<span style="color:white">Eliminar</span>',
                        icon: 'https://cdn1.alegra.com/images/icons/delete.png',
                        action: 'delete'
                    },
                    {
                        style: 'background-color : #00BFA5;',
                        text: '<span style="color:white">Modificar</span>',
                        icon: 'https://cdn1.alegra.com/images/icons/page_edit.png',
                        action: 'edit'
                    },
                    {

                        xtype: 'textfield',
                        itemId: 'searchBar',
                        cls: 'search-bar',
                        width: 230,
                        margin: '0 0 0 10',
                    },
                    {
                        text: 'Buscar por nombre',
                        iconCls: 'show',
                        action: 'all'
                    },
                ]
            },
            {
                xtype: 'pagingtoolbar',
                store: 'Contacts',
                dock: 'bottom',
                displayInfo: true
            }
        ];

        this.callParent(arguments);
    }

});
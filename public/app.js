Ext.Loader.setConfig(
    {
        enabled: true
    }
);

Ext.application({
    name: 'CrudExt',
    appFolder: 'app',
    controllers: ['Contact'],
    launch: function() {
        Ext.create('Ext.panel.Panel',{
            renderTo:'contacts_store',
            layout: 'fit',
            items: [
                Ext.create('CrudExt.view.contact.Grid')
            ]
        });
    }
});
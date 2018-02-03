Ext.define('Alegra.controller.Contacts', {
    extend: 'Ext.app.Controller',
    stores: ['Contacts'],
    models: ['Contact'],
    views: ['contact.Form', 'contact.Grid', 'contact.Show'],
    refs: [{
        ref: 'contactPanel',
        selector: 'panel',
    }, {
        ref: 'contactGrid',
        selector: 'grid',
    }],
    init: function() {
        this.control({
            //'actioncolumn': {
            //	itemClick: this.onActionColumnItemClick,
            //},
            'contactGrid dataview': {
                itemdblclick: this.editContact,
            },
            'contactGrid button[action=add]': {
                click: this.editContact,
            },
            'contactGrid button[action=delete]': {
                click: this.destroyContact,
            },
            'contactForm button[action=save]': {
                click: this.createOrUpdateContact,
            },
        });
    },

    editContact(grid, record) {
        let editar = Ext.create('Alegra.view.contact.Form').show();
        // Si se edita un record.
        if (record.stores != null) {
            editar.down('form').loadRecord(record);
        }
    },
    createOrUpdateContact(button) {
        let win = button.up('window');
        let form = win.down('form');
        let record = form.getRecord();
        let values = form.getValues();
        let add = false;
        let msg = 'Contacto actualizado exitosamente';

        if (values.id > 0) {
            record.set(values);
        } else {
            record = Ext.create('Alegra.model.Contact');
            record.set(values);
            this.getContactsStore().add(record);
            add = true;
            msg = 'Contacto creado exitosamente';
        }

        let myMask = new Ext.LoadMask(Ext.getBody(), { msg: "Por favor, espere..." });
        myMask.show();
        this.getContactsStore().sync({
            success: function(batch, action) {
                myMask.hide();
                // Cargar de nuevo el store.
                if (add) {
                    this.getContactsStore().load();
                }
                let reader = batch.proxy.getReader();
                Ext.Msg.alert('Success', msg);
                win.close();
            },
            failure: function(batch, action) {
                myMask.hide();
                let reader = batch.proxy.getReader();
                Ext.Msg.alert('Failed', reader.jsonData ? reader.jsonData.message : 'No response');
            },
            scope: this,
        });
    },
    destroyContact(button) {
        let grid = this.getContactGrid();
        let records = grid.getSelectionModel().getSelection();
        let store = this.getContactsStore();
        let title = records.length > 1 ? 'Eliminar ' + records.length + ' clientes' : 'Eliminar cliente';
        let msg = records.length > 1 ? '¿Estás seguro de que deseas eliminar ' + records.length + ' clientes? Esta operación no se puede deshacer.' : '¿Estás seguro de que deseas eliminar el cliente? Esta operación no se puede deshacer';

        if (records.length > 0) {
            Ext.Msg.show({
                title,
                msg,
                buttons: Ext.Msg.YESNOCANCEL,
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                width: 600,
                fn: function(btn) {
                    if (btn == 'yes') {
                        let myMask = new Ext.LoadMask(Ext.getBody(), { msg: "Por favor, espere..." });
                        myMask.show();
                        store.remove(records);
                        this.getContactsStore().sync({
                            success: function(batch, action) {
                                myMask.hide();
                                // Cargar de nuevo el store.
                                this.getContactsStore().load();
                                let reader = batch.proxy.getReader();
                                Ext.Msg.alert('Success', reader.jsonData.message);
                            },
                            failure: function(batch, action) {
                                myMask.hide();
                                let reader = batch.proxy.getReader();
                                Ext.Msg.alert('Failed', reader.jsonData ? reader.jsonData.message : 'No response');
                            },
                            scope: this,
                        });
                    }
                },
            });
        }
    },
});
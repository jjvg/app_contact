Ext.define('CrudExt.controller.Contact', {
    extend: 'Ext.app.Controller',
    views: ['contact.Grid', 'contact.Form', 'contact.Window'],
    models: ['Contact', 'InternalContact'],
    stores: ['Contacts', 'InternalContacts'],
    refs: [{
        ref: 'list',
        selector: 'contactgrid'
    }],

    /**
     * This function load init actions
     */
    init: function() {
        this.control({
            'contactgrid button[action=edit]': {
                click: this.edit
            },
            'contactgrid': {
                itemdblclick: this.edit
            },
            'contactgrid button[action=add]': {
                click: this.add
            },
            'contactgrid button[action=delete]': {
                click: this.destroy
            },
            'contactform button[action=save]': {
                click: this.save
            },
            'contactgrid button[action=all]': {
                click: this.all
            },
        });
    },

    /**
     * Open window from record contact
     */
    add: function() {
        var me = this,
            view = Ext.widget('contactedit'),
            gridInternalContacts = Ext.ComponentQuery.query("#inernalcontactgrid")[0];


        var newData = Ext.create('Ext.data.Store', {
            model: 'CrudExt.model.InternalContact',
            data: [{
                internal_name: '',
                internal_lastName: '',
                internal_email: '',
                internal_phone: '',
                internal_mobile: '',
                internal_sendNotifications: ''
            }]
        });

        gridInternalContacts.reconfigure(newData);

        view.setTitle('Agregando contacto');
    },

    /**
     * Filter contact by name
     */
    all: function() {
        var me = this,
            item = Ext.ComponentQuery.query("#searchBar")[0],
            searchString = item.rawValue,
            grid = me.getList(),
            store = grid.getStore();

        store.clearFilter(true);

        if (searchString && searchString != '') {
            store.filter(searchString);

        } else {
            Ext.Msg.alert('Error', 'Debe escribir el nombre del contacto para poder buscar los resultados');
        }
    },

    /**
     * Open window from record contact with store data
     */
    edit: function(btn) {
        var me = this,
            grid = me.getList(),
            records = grid.getSelectionModel().getSelection();

        if (records.length === 1) {
            var record = records[0],
                view = Ext.widget('contactedit'),
                form = view.down('contactform').getForm(),
                gridInternalContacts = Ext.ComponentQuery.query("#inernalcontactgrid")[0],
                interContactsArray = [];

            for (var i in record.data.internalContacts) {
                interContactsArray.push({
                    internal_id: record.data.internalContacts[i].id,
                    internal_name: record.data.internalContacts[i].name,
                    internal_lastName: record.data.internalContacts[i].lastName,
                    internal_email: record.data.internalContacts[i].email,
                    internal_phone: record.data.internalContacts[i].phone,
                    internal_mobile: record.data.internalContacts[i].mobile,
                    internal_sendNotifications: record.data.internalContacts[i].sendNotifications
                });
            }

            var newData = Ext.create('Ext.data.Store', {
                model: 'CrudExt.model.InternalContact',
                data: interContactsArray
            });

            gridInternalContacts.reconfigure(newData);

            form.loadRecord(record);
            view.setTitle('Modificando contacto');

        } else {
            Ext.Msg.alert('Error', 'Más de uma línea seleccionada');
        }
    },

    /**
     * Save a new record to Contact model
     */
    save: function(btn) {
        var me = this,
            form = btn.up('contactform'),
            win = form.up('window'),
            basicForm = form.getForm(),
            grid = me.getList(),
            store = grid.getStore(),
            record = basicForm.getRecord(),
            values = basicForm.getValues(),
            internalContacts = [],
            inernalcontactgrid = Ext.ComponentQuery.query('#inernalcontactgrid')[0],
            makeUndefined = function(value) {
                return value != '' ? value : undefined;
            };

        inernalcontactgrid.getStore().each(function(record) {
            var fields = record.data,
                gridData = {
                    id: makeUndefined(fields.internal_id),
                    name: makeUndefined(fields.internal_name),
                    lastName: makeUndefined(fields.internal_lastName),
                    email: makeUndefined(fields.internal_email),
                    phone: makeUndefined(fields.internal_phone),
                    mobile: makeUndefined(fields.internal_mobile),
                    sendNotifications: makeUndefined(fields.internal_sendNotifications)
                };

            if (JSON.stringify(gridData) !== '{}') {
                internalContacts.push(gridData);
            }
        });

        if (internalContacts.length === 0) internalContacts = [{
            name: '',
            lastName: '',
            email: '',
            phone: '',
            mobile: '',
            sendNotifications: ''
        }];

        values.internalContacts = internalContacts;

        if (basicForm.isValid()) {
            if (!record) {
                record = Ext.create('CrudExt.model.Contact');
                record.set(values);
                store.add(record);
                msg = 'Contacto creado exitosamente';
            } else {
                record.set(values);
                msg = 'Contacto Modificado exitosamente';
            }
            let myMask = new Ext.LoadMask(Ext.getBody(), { msg: "Por favor, espere..." });
            myMask.show();
            store.sync({

                success: function() {
                    myMask.hide();
                    Ext.Msg.alert('Success', msg);
                    console.log("Positivo papa");
                    location.reload();

                },
                failure: function() {
                    console.log("failed...");
                },
                callback: function() {
                    console.log("calling callback");
                },
                scope: this
            });

            win.close();

        } else {
            Ext.Msg.alert('Error', 'Error al guardar los datos');
        }
    },

    /**
     * Delete contact
     */
    destroy: function() {
        var me = this,
            grid = me.getList(),
            store = grid.getStore(),
            records = grid.getSelectionModel().getSelection();

        if (records.length === 0) {
            Ext.Msg.alert('Error', 'Ningua línea seleccionada');
        } else {
            Ext.Msg.show({
                title: 'Confirmar',
                msg: 'Seguro que quiere eliminar los contactos selecionado?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.MessageBox.WARNING,
                scope: this,
                width: 450,
                fn: function(btn, ev) {
                    if (btn == 'yes') {
                        store.remove(records);
                        store.sync();
                    }
                }
            });
        }
    },
});
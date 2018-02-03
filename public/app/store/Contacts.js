/**
 * Mark as undefined the fields 
 */
var makeUndefined = function(value) {
    return value != '' ? value : undefined;
};

Ext.define('CrudExt.store.Contacts', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    remoteFilter: true,
    storeId: 'Contacts',
    leadingBufferZone: 20,
    pageSize: 10,
    model: 'CrudExt.model.Contact',
    proxy: {
        type: 'ajax',
        api: {
            create: 'api/create',
            read: 'api/all',
            update: 'api/update',
            destroy: 'api/delete',
        },
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'POST',
            destroy: 'POST',
        },
        reader: {
            type: 'json',
            root: 'data',
            rootProperty: 'data',
            successProperty: 'success',
            messageProperty: 'message',
            totalProperty: 'results'
        },

        writer: Ext.create('Ext.data.writer.Json', {
            root: 'data',
            encode: true,
            writeAllFields: true,
            getRecordData: function(record) {

                var typeContact = [],
                    client = Ext.ComponentQuery.query("#contactclient")[0],
                    provider = Ext.ComponentQuery.query("#contactprovider")[0];

                if (client && client.checked === true) typeContact.push('client');
                if (provider && provider.checked === true) typeContact.push('provider');

                return {
                    id: record.data.id,
                    name: record.data.name,
                    identification: makeUndefined(record.data.identification),
                    phonePrimary: makeUndefined(record.data.phonePrimary),
                    phoneSecondary: makeUndefined(record.data.phoneSecondary),
                    fax: makeUndefined(record.data.fax),
                    mobile: makeUndefined(record.data.mobile),
                    observations: makeUndefined(record.data.observations),
                    email: makeUndefined(record.data.email),
                    priceList: record.data.priceList,
                    seller: makeUndefined(record.data.seller),
                    term: makeUndefined(record.data.term),
                    address: {
                        address: makeUndefined(record.data.address),
                        city: makeUndefined(record.data.city)
                    },
                    type: typeContact,
                    internalContacts: record.data.internalContacts,
                    // internalContacts: makeUndefined(record.data.internalContacts), 
                };
            }
        })
    }
});
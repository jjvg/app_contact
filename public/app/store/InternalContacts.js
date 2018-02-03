Ext.define('CrudExt.store.InternalContacts',{
	extend: 'Ext.data.Store',
    model: 'CrudExt.model.InternalContact',
	storeId	: 'InternalContacts',
	autoLoad: false,
	autoSync: false,
	data : [
		{
	    	internal_name: '',
			internal_lastName: '',
			internal_email: '',
			internal_phone: '',
			internal_mobile: '',
			internal_sendNotifications: ''
	    }
	]
});
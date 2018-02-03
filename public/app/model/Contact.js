Ext.define('CrudExt.model.Contact',{
	extend		: 'Ext.data.Model',
	fields : [
				'id', 'name', 'identification', 'phonePrimary', 
				'phoneSecondary', 'fax', 'mobile', 'observations', 
				'email', 'seller', 'internalContacts', 'type', 
				'client', 'provider', 'term', 'priceList',
				{ name: 'address', mapping: 'address.address' },
				{ name: 'city', mapping: 'address.city' },
			],
    idProperty: 'id',
    validations: [
		{ type: 'presence', name: 'name' },
	],
});
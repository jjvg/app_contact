Ext.define('CrudExt.model.InternalContact',{
	extend: 'Ext.data.Model',
	fields : [
		'internal_id',
		'internal_name',
		'internal_lastName',
		'internal_email',
		'internal_phone',
		'internal_mobile',
		'internal_sendNotifications',
	],
});
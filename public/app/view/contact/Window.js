Ext.define('CrudExt.view.contact.Window', {

	extend: 'Ext.window.Window',
	title: 'Editando registro',
	width: '80%',
	height: '90%',
	layout: 'fit',
	autoShow: true,
	modal: true,
	alias: 'widget.contactedit',

	initComponent: function(){
		this.items = [
			Ext.widget('contactform'),
		];
		this.callParent(arguments);
	}

});
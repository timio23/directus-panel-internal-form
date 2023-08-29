import PanelComponent from './panel.vue';

export default {
    id: 'panel-internal-form',
    name: 'Internal Form',
    icon: 'view_day',
    description: 'Output a form to insert data into a collection.',
	component: PanelComponent,
	options: [
		{
			field: 'collection',
			type: 'string',
			name: '$t:collection',
			meta: {
				interface: 'system-collection',
				options: {
					includeSystem: true,
					includeSingleton: false,
				},
				width: 'half',
			},
		},
		{
			field: 'fields',
			type: 'string',
			name: 'Included Fields',
			meta: {
				interface: 'system-field',
				options: {
					collectionField: 'collection',
					multiple: true,
				},
				width: 'half',
			},
		},
	],
	minWidth: 12,
	minHeight: 8,
};

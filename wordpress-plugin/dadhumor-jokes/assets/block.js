( function ( blocks, element, blockEditor, components, serverSideRender ) {
	var el                = element.createElement;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody         = components.PanelBody;
	var SelectControl     = components.SelectControl;
	var ToggleControl     = components.ToggleControl;
	var ServerSideRender  = serverSideRender.default || serverSideRender;

	blocks.registerBlockType( 'dadhumor/joke', {
		title:       'Dad Humor – Daily Joke',
		icon:        'format-status',
		category:    'widgets',
		description: "Display today's dad joke from dadhumor.app.",
		keywords:    [ 'dad joke', 'humor', 'joke of the day' ],

		attributes: {
			theme:         { type: 'string', default: 'dark' },
			show_category: { type: 'string', default: 'true' },
			show_link:     { type: 'string', default: 'true' },
		},

		edit: function ( props ) {
			var attrs      = props.attributes;
			var setAttrs   = props.setAttributes;

			return el(
				'div',
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: 'Display Settings', initialOpen: true },
						el( SelectControl, {
							label:    'Theme',
							value:    attrs.theme,
							options:  [
								{ label: 'Dark', value: 'dark' },
								{ label: 'Light', value: 'light' },
							],
							onChange: function ( v ) { setAttrs( { theme: v } ); },
						} ),
						el( ToggleControl, {
							label:    'Show category',
							checked:  attrs.show_category === 'true',
							onChange: function ( v ) { setAttrs( { show_category: v ? 'true' : 'false' } ); },
						} ),
						el( ToggleControl, {
							label:    'Show "More jokes" link',
							checked:  attrs.show_link === 'true',
							onChange: function ( v ) { setAttrs( { show_link: v ? 'true' : 'false' } ); },
						} )
					)
				),
				el( ServerSideRender, {
					block:      'dadhumor/joke',
					attributes: attrs,
				} )
			);
		},

		// Server-side rendered - no static save output needed
		save: function () { return null; },
	} );

} )(
	window.wp.blocks,
	window.wp.element,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.serverSideRender
);

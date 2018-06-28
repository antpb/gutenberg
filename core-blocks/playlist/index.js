/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';

export const name = 'core/playlist';

export const settings = {
	title: __( 'Playlist' ),

	description: __( 'The Playlist block allows you to embed playlist files and play them back using a Core playlist.' ),

	icon: 'format-audio',

	category: 'common',

	attributes: {
		ids: {
			type: 'string',
		},
		type: {
			type: 'string',
		},
		artists: {
			type: 'boolean',
			default: true,
		},
		images: {
			type: 'boolean',
			default: true,
		},
		tracklist: {
			type: 'boolean',
			default: true,
		},
		style: {
			type: 'string',
			default: 'light',
		},
		align: {
			type: 'string',
		},
	},

	supports: {
		align: true,
		html: false,
	},

	edit,

	save() {
		return null;
	},
};
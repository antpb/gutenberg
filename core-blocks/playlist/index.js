/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	FormFileUpload,
	IconButton,
	Placeholder,
	ServerSideRender,
	Toolbar,
} from '@wordpress/components';
import { pick } from 'lodash';
import { Component, Fragment } from '@wordpress/element';
import {
	MediaUpload,
 	BlockControls,
} from '@wordpress/editor';
import {	RichText } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';

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
		src: {
			type: 'string',
		},
		type: {
			type: 'string',
		}
	},

	supports: {
		align: true,
	},

	edit: class extends Component {
		constructor() {
			super( ...arguments );

			this.initializePlaylist = this.initializePlaylist.bind( this );

			// check for if ids is set to determine edit state
			this.state = {
				editing: ! this.props.attributes.ids,
			};
		}

		initializePlaylist() {
			window.wp.playlist.initialize();
		}

		render() {
			const { ServerSideRender } = wp.components;
			const { ids, type } = this.props.attributes;
			const { setAttributes, className} = this.props;
			const { editing } = this.state;
			const switchToEditing = () => {
				this.setState( { editing: true } );
			};
			const onSelectMedia = ( media ) => {
				//check if there are returned media items and set attributes when there are
				if ( media && media[0].url ) {
					media = ( 1 < media.length ) ? media : [ media ];
					const ids = JSON.stringify( media.map( ( item ) => item.id ) );
					setAttributes( { ids, type: media[0].type  } );
					this.setState( { editing: false } );
				}
			};
			const onSelectUrl = ( event ) => {
				event.preventDefault();
				if ( ids ) {
					this.setState( { editing: false } );
				}
				return false;
			};
			const setAudio = ( [ audio ] ) => onSelectMedia( audio );
			const uploadFromFiles = ( event ) => editorMediaUpload( event.target.files, setAudio, 'audio' );
			const config = {};

			if ( editing ) {
				return (
					<Placeholder
						icon="media-audio"
						label={ __( 'Audio/Video Playlist' ) }
						instructions={ __( 'Select audio or video files from your library, or upload a new ones' ) }
						className={ className }>
						<FormFileUpload
							isLarge
							className="wp-block-audio__upload-button"
							onChange={ uploadFromFiles }
							accept="audio/*"
						>
							{ __( 'Upload' ) }
						</FormFileUpload>
						<MediaUpload
							onSelect={ onSelectMedia }
							type="audio"
							multiple
							playlist
							render={ ( { open } ) => (
								<Button isLarge onClick={ open }>
									{ __( 'Media Library' ) }
								</Button>
							) }
						/>
					</Placeholder>
				);
			}

			/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
			return (
				<Fragment>
					<BlockControls>
						<Toolbar>
							<IconButton
								className="components-icon-button components-toolbar__control"
								label={ __( 'Edit playlist' ) }
								onClick={ switchToEditing }
								icon="edit"
							/>
						</Toolbar>
					</BlockControls>
					<figure className={ className }>
					<ServerSideRender
							block="core/playlist"
							attributes={ this.props.attributes }
							onChange={ this.initializePlaylist }
					/>
					</figure>
				</Fragment>
			);
			/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
		}
	},

	save( { attributes } ) {
		return null;
	},
};

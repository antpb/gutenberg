
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	FormFileUpload,
	IconButton,
	Placeholder,
	ServerSideRender,
	Toolbar,
	withNotices,
	CheckboxControl,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import { Component, Fragment } from '@wordpress/element';
import {
	BlockControls,
	InspectorControls,
	mediaUpload,
	MediaUpload,
} from '@wordpress/editor';

const MAX_COLUMNS = 8;

class ClassicGallery extends Component {
	constructor() {
		super( ...arguments );

		this.setColumnsNumber = this.setColumnsNumber.bind( this );
		this.uploadFromFiles = this.uploadFromFiles.bind( this );
		this.onUploadFiles = this.onUploadFiles.bind( this );
		this.onSelectMedia = this.onSelectMedia.bind( this );
	}

	uploadFromFiles( event ) {
		const { noticeOperations } = this.props;
		if ( ! event.target.files ) {
			noticeOperations.createErrorNotice( __( 'Files list provided is empty' ) );
			return;
		}
		this.onUploadFiles( event.target.files );
	}

	onUploadFiles( files ) {
		const { setAttributes } = this.props;

		mediaUpload( {
			allowedType: 'image',
			filesList: files,
			onFileChange: ( media ) => {
				if ( media.length > 0 ) {
					const ids = media.map( ( item ) => item.id );
					setAttributes( { ids, columns: ids.length } );
				}
			},
		} );
	}

	onSelectMedia( media ) {
		const { setAttributes } = this.props;
		//check if there are returned media items and set attributes when there are
		const ids = media.map( ( item ) => item.id );

		setAttributes( { ids } );
	}

	toggleAttribute( attribute ) {
		return ( newValue ) => {
			this.props.setAttributes( { [ attribute ]: newValue } );
		};
	}

	setColumnsNumber( value ) {
		this.props.setAttributes( { columns: value } );
	}

	render() {
		const { attributes, className, noticeUI } = this.props;
		const { ids, randomize, columns, size, linkTo } = attributes;

		if ( ! this.props.attributes.ids ) {
			return (
				<Placeholder
					icon="media-image"
					label={ __( 'Classic Gallery' ) }
					notices={ noticeUI }
					instructions={ __( 'Select image files from your library, or upload new ones.' ) }
					className={ className }>
					<FormFileUpload
						isLarge
						multiple
						className="wp-block-classic-gallery__upload-button"
						onChange={ this.uploadFromFiles }
						accept="image/*"
					>
						{ __( 'Upload' ) }
					</FormFileUpload>
					<MediaUpload
						onSelect={ this.onSelectMedia }
						allowedType={ 'image' }
						multiple
						gallery
						classicGallery
						value={ ids }
						render={ ( { open } ) => (
							<IconButton
								isLarge
								icon="edit"
								label={ __( 'Media Library' ) }
								onClick={ open }
							>
								{ __( 'Media Library' ) }
							</IconButton>
						) }
					/>
				</Placeholder>
			);
		}

		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<MediaUpload
							onSelect={ this.onSelectMedia }
							allowedType={ 'image' }
							multiple
							gallery
							classicGallery
							value={ ids }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Edit Classic Gallery' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={ __( 'Classic Gallery Controls' ) }>
						<SelectControl
							label={ __( 'Link To' ) }
							value={ linkTo }
							onChange={ this.toggleAttribute( 'style' ) }
							options={ [
								{ value: 'file', label: __( 'Media File' ) },
								{ value: 'attachementPage', label: __( 'Attachment Page' ) },
								{ value: 'none', label: __( 'None' ) },
							] }
						/>
						<SelectControl
							label={ __( 'Image Sizes' ) }
							value={ size }
							onChange={ this.toggleAttribute( 'style' ) }
							options={ [
								{ value: 'thumbnail', label: __( 'Thumbnail' ) },
								{ value: 'medium', label: __( 'Medium' ) },
								{ value: 'large', label: __( 'Large' ) },
								{ value: 'full', label: __( 'Full Size' ) },
							] }
						/>
						<RangeControl
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ this.setColumnsNumber }
							min={ 1 }
							max={ Math.min( MAX_COLUMNS, ids.length ) }
						/>
						<CheckboxControl
							label={ __( 'Random Order' ) }
							onChange={ this.toggleAttribute( 'randomize' ) }
							checked={ randomize }
						/>
					</PanelBody>
				</InspectorControls>
				<figure className={ className }>
					<ServerSideRender
						block="core/classic-gallery"
						attributes={ attributes }
					/>
				</figure>
			</Fragment>
		);
	}
}

export default withNotices( ClassicGallery );

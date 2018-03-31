/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Dropdown, IconButton } from '@wordpress/components';
import { createBlock, isUnmodifiedDefaultBlock, hasBlockSupport } from '@wordpress/blocks';
import { Component, compose } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import InserterMenu from './menu';
import InserterTokenMenu from './token-menu';

class Inserter extends Component {
	constructor() {
		super( ...arguments );

		this.onToggle = this.onToggle.bind( this );
		this.isInsertingInline = this.isInsertingInline.bind( this );
		this.state = {
			isInline: false,
		};
	}

	onToggle( isOpen ) {
		const { onToggle } = this.props;

		if ( isOpen ) {
			if ( this.isInsertingInline() ) {
				this.setState( { isInline: true } );
				// TODO: show inline insertion point
			} else {
				this.setState( { isInline: false } );
				this.props.showInsertionPoint();
			}
		} else {
			this.props.hideInsertionPoint();
		}

		// Surface toggle callback to parent component
		if ( onToggle ) {
			onToggle( isOpen );
		}
	}

	isInsertingInline() {
		const { selectedBlock } = this.props;

		return selectedBlock &&
			hasBlockSupport( selectedBlock.name, 'inlineToken' ) &&
			selectedBlock.attributes.content &&
			selectedBlock.attributes.content.length > 0;
	}

	render() {
		const {
			position,
			title,
			children,
			onInsertBlock,
			hasSupportedBlocks,
			isLocked,
		} = this.props;

		if ( ! hasSupportedBlocks || isLocked ) {
			return null;
		}

		return (
			<Dropdown
				className="editor-inserter"
				position={ position }
				onToggle={ this.onToggle }
				expandOnMobile
				headerTitle={ title }
				renderToggle={ ( { onToggle, isOpen } ) => (
					<IconButton
						icon="insert"
						label={ __( 'Add block' ) }
						onClick={ onToggle }
						className="editor-inserter__toggle"
						aria-haspopup="true"
						aria-expanded={ isOpen }
					>
						{ children }
					</IconButton>
				) }
				renderContent={ ( { onClose } ) => {
					const onSelect = ( item ) => {
						onInsertBlock( item );

						onClose();
					};

					if ( this.state.isInline ) {
						return <InserterTokenMenu />;
					}

					return <InserterMenu onSelect={ onSelect } />;
				} }
			/>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const {
			getEditedPostAttribute,
			getBlockInsertionPoint,
			getSelectedBlock,
			getSupportedBlocks,
			getEditorSettings,
		} = select( 'core/editor' );
		const { allowedBlockTypes, templateLock } = getEditorSettings();
		const insertionPoint = getBlockInsertionPoint();
		const { rootUID } = insertionPoint;
		const supportedBlocks = getSupportedBlocks( rootUID, allowedBlockTypes );
		return {
			title: getEditedPostAttribute( 'title' ),
			insertionPoint,
			selectedBlock: getSelectedBlock(),
			hasSupportedBlocks: true === supportedBlocks || ! isEmpty( supportedBlocks ),
			isLocked: !! templateLock,
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => ( {
		showInsertionPoint: dispatch( 'core/editor' ).showInsertionPoint,
		hideInsertionPoint: dispatch( 'core/editor' ).hideInsertionPoint,
		onInsertBlock: ( item ) => {
			const { insertionPoint, selectedBlock } = ownProps;
			const { index, rootUID, layout } = insertionPoint;
			const { name, initialAttributes } = item;
			const insertedBlock = createBlock( name, { ...initialAttributes, layout } );
			if ( selectedBlock && isUnmodifiedDefaultBlock( selectedBlock ) ) {
				return dispatch( 'core/editor' ).replaceBlocks( selectedBlock.uid, insertedBlock );
			}
			return dispatch( 'core/editor' ).insertBlock( insertedBlock, index, rootUID );
		},
	} ) ),
] )( Inserter );

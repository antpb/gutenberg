/**
 * WordPress dependencies
 */
import { withContext } from '@wordpress/components';

function InnerBlocks( { BlockList, layouts, allowedBlocks, locking, template } ) {
	return <BlockList { ...{ layouts, allowedBlocks, locking, template } } />;
}

InnerBlocks = withContext( 'BlockList' )()( InnerBlocks );

InnerBlocks.Content = ( { BlockContent } ) => {
	return <BlockContent />;
};

InnerBlocks.Content = withContext( 'BlockContent' )()( InnerBlocks.Content );

export default InnerBlocks;

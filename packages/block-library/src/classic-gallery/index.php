<?php
/**
 * Server-side rendering of the `core/classic-gallery` block.
 *
 * @package gutenberg
 */

/**
 * Renders the `core/classic-gallery` block on the server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Gallery shortcode output. Empty string if the passed type is unsupported.
 */
function render_block_classic_gallery( $attributes ) {
	$classes = 'wp-block-classic-gallery';

	if ( ! empty( $attributes['align'] ) ) {
		$classes .= ' align' . $attributes['align'];
	}
	$html = sprintf( '<figure class="%s">%s</figure>', esc_attr( $classes ), do_shortcode( '[ gallery ids="' . implode( ',', $attributes['ids'] ) . '" ]' ) );

	return $html;
}

/**
 * Registers the `core/classic-gallery` block on server.
 */
function register_block_classic_gallery() {
	register_block_type(
		'core/classic-gallery',
		array(
			'render_callback' => 'render_block_classic_gallery',
		)
	);
}

add_action( 'init', 'register_block_classic_gallery' );

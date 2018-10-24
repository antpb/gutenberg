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

	if ( $attributes['randomize'] ) {
		$attributes['randomize'] = 'rand';
	} else {
		$attributes['randomize'] = 'menu_order';
	}

	$html = sprintf( '<figure class="%s">%s</figure>', esc_attr( $classes ), do_shortcode( '[gallery columns="' . $attributes['columns'] . '" link="' . $attributes['linkTo'] . '" size="' . $attributes['size'] . '" ids="' . implode( ',', $attributes['ids'] ) . '" orderby="' . $attributes['randomize'] . '"]' ) );

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
			'attributes'      => array(
				'ids'              => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'number',
					),
				),
				'randomize'             => array(
					'type'    => 'boolean',
					'default' => 'false',
				),
				'columns'             => array(
					'type'    => 'number',
				),
				'size'             => array(
					'type'    => 'string',
					'default' => 'thumbnail',
				),
				'linkTo'             => array(
					'type'    => 'string',
					'default' => 'file',
				),
			),
		)
	);
}

add_action( 'init', 'register_block_classic_gallery' );

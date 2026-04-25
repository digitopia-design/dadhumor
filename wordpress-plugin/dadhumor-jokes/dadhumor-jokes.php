<?php
/**
 * Plugin Name: Dad Humor – Daily Jokes
 * Plugin URI:  https://dadhumor.app
 * Description: Display today's dad joke anywhere on your site. Shortcode, widget, and Gutenberg block included. Professionally unfunny since 2026.
 * Version:     1.0.0
 * Author:      Digitopia Design Ltd
 * Author URI:  https://dadhumor.app
 * License:     GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: dadhumor
 */

defined( 'ABSPATH' ) || exit;

define( 'DADHUMOR_VERSION',     '1.0.0' );
define( 'DADHUMOR_API_URL',     'https://dadhumor.app/api/v1/joke-of-the-day' );
define( 'DADHUMOR_CACHE_KEY',   'dadhumor_joke_of_the_day' );
define( 'DADHUMOR_CACHE_TTL',   HOUR_IN_SECONDS );

// ---------------------------------------------------------------------------
// API + caching
// ---------------------------------------------------------------------------

function dadhumor_get_joke(): ?array {
	$cached = get_transient( DADHUMOR_CACHE_KEY );
	if ( $cached !== false ) {
		return $cached;
	}

	$response = wp_remote_get( DADHUMOR_API_URL, [
		'timeout' => 5,
		'headers' => [ 'Accept' => 'application/json' ],
	] );

	if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
		return null;
	}

	$data = json_decode( wp_remote_retrieve_body( $response ), true );

	if ( empty( $data['setup'] ) || empty( $data['punchline'] ) ) {
		return null;
	}

	set_transient( DADHUMOR_CACHE_KEY, $data, DADHUMOR_CACHE_TTL );

	return $data;
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function dadhumor_render_joke( array $atts = [] ): string {
	$atts = shortcode_atts( [
		'theme'         => 'dark',
		'show_category' => 'true',
		'show_link'     => 'true',
	], $atts, 'dad_joke' );

	$joke = dadhumor_get_joke();

	if ( ! $joke ) {
		return '<div class="dadhumor-widget dadhumor-dark dadhumor-error">Fetching fresh groans… check back soon.</div>';
	}

	$category   = ! empty( $joke['category'] ) ? esc_html( ucfirst( str_replace( '-', ' ', $joke['category'] ) ) ) : '';
	$url        = ! empty( $joke['url'] ) ? esc_url( $joke['url'] ) : 'https://dadhumor.app';
	$theme_class = $atts['theme'] === 'light' ? 'dadhumor-light' : 'dadhumor-dark';

	ob_start(); ?>
	<div class="dadhumor-widget <?php echo esc_attr( $theme_class ); ?>">
		<?php if ( $atts['show_category'] === 'true' && $category ) : ?>
			<span class="dadhumor-category"><?php echo $category; ?></span>
		<?php endif; ?>
		<p class="dadhumor-setup"><?php echo esc_html( $joke['setup'] ); ?></p>
		<p class="dadhumor-punchline"><?php echo esc_html( $joke['punchline'] ); ?></p>
		<?php if ( $atts['show_link'] === 'true' ) : ?>
			<a class="dadhumor-credit" href="<?php echo $url; ?>" target="_blank" rel="noopener noreferrer">
				More dad jokes at dadhumor.app
			</a>
		<?php endif; ?>
	</div>
	<?php
	return ob_get_clean();
}

// ---------------------------------------------------------------------------
// Shortcode
// ---------------------------------------------------------------------------

add_shortcode( 'dad_joke', 'dadhumor_render_joke' );

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'dadhumor',
		plugin_dir_url( __FILE__ ) . 'assets/style.css',
		[],
		DADHUMOR_VERSION
	);
} );

// ---------------------------------------------------------------------------
// Classic widget
// ---------------------------------------------------------------------------

class DadHumor_Widget extends WP_Widget {

	public function __construct() {
		parent::__construct(
			'dadhumor_widget',
			'Dad Humor – Daily Joke',
			[ 'description' => 'Displays today\'s dad joke from dadhumor.app.' ]
		);
	}

	public function widget( $args, $instance ) {
		echo $args['before_widget'];

		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title']
				. apply_filters( 'widget_title', esc_html( $instance['title'] ) )
				. $args['after_title'];
		}

		echo dadhumor_render_joke( [
			'theme'         => $instance['theme']         ?? 'dark',
			'show_category' => $instance['show_category'] ?? 'true',
			'show_link'     => $instance['show_link']     ?? 'true',
		] );

		echo $args['after_widget'];
	}

	public function form( $instance ) {
		$title         = $instance['title']         ?? 'Joke of the Day';
		$theme         = $instance['theme']         ?? 'dark';
		$show_category = $instance['show_category'] ?? 'true';
		$show_link     = $instance['show_link']     ?? 'true';
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">Title:</label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"
			       name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>"
			       type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'theme' ) ); ?>">Theme:</label>
			<select class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'theme' ) ); ?>"
			        name="<?php echo esc_attr( $this->get_field_name( 'theme' ) ); ?>">
				<option value="dark"  <?php selected( $theme, 'dark' );  ?>>Dark</option>
				<option value="light" <?php selected( $theme, 'light' ); ?>>Light</option>
			</select>
		</p>
		<p>
			<label>
				<input type="checkbox"
				       name="<?php echo esc_attr( $this->get_field_name( 'show_category' ) ); ?>"
				       value="true" <?php checked( $show_category, 'true' ); ?>>
				Show category
			</label>
		</p>
		<p>
			<label>
				<input type="checkbox"
				       name="<?php echo esc_attr( $this->get_field_name( 'show_link' ) ); ?>"
				       value="true" <?php checked( $show_link, 'true' ); ?>>
				Show "More jokes" link
			</label>
		</p>
		<?php
	}

	public function update( $new_instance, $old_instance ): array {
		return [
			'title'         => sanitize_text_field( $new_instance['title'] ?? '' ),
			'theme'         => in_array( $new_instance['theme'] ?? '', [ 'dark', 'light' ], true ) ? $new_instance['theme'] : 'dark',
			'show_category' => ! empty( $new_instance['show_category'] ) ? 'true' : 'false',
			'show_link'     => ! empty( $new_instance['show_link'] ) ? 'true' : 'false',
		];
	}
}

add_action( 'widgets_init', fn() => register_widget( 'DadHumor_Widget' ) );

// ---------------------------------------------------------------------------
// Gutenberg block
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	wp_register_script(
		'dadhumor-block-editor',
		plugin_dir_url( __FILE__ ) . 'assets/block.js',
		[ 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-server-side-render' ],
		DADHUMOR_VERSION,
		true
	);

	wp_register_style(
		'dadhumor-block-editor-style',
		plugin_dir_url( __FILE__ ) . 'assets/style.css',
		[],
		DADHUMOR_VERSION
	);

	register_block_type( 'dadhumor/joke', [
		'editor_script'   => 'dadhumor-block-editor',
		'editor_style'    => 'dadhumor-block-editor-style',
		'style'           => 'dadhumor',
		'render_callback' => 'dadhumor_render_joke',
		'attributes'      => [
			'theme'         => [ 'type' => 'string', 'default' => 'dark' ],
			'show_category' => [ 'type' => 'string', 'default' => 'true' ],
			'show_link'     => [ 'type' => 'string', 'default' => 'true' ],
		],
	] );
} );

// ---------------------------------------------------------------------------
// Settings page
// ---------------------------------------------------------------------------

add_action( 'admin_menu', function () {
	add_options_page(
		'Dad Humor',
		'Dad Humor',
		'manage_options',
		'dadhumor',
		'dadhumor_settings_page'
	);
} );

function dadhumor_settings_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	if (
		isset( $_POST['dadhumor_clear_cache'] ) &&
		check_admin_referer( 'dadhumor_clear_cache', 'dadhumor_nonce' )
	) {
		delete_transient( DADHUMOR_CACHE_KEY );
		echo '<div class="notice notice-success is-dismissible"><p>Cache cleared. Fresh groans incoming.</p></div>';
	}

	$joke = dadhumor_get_joke();
	?>
	<div class="wrap">
		<h1>Dad Humor</h1>
		<p>Powered by <a href="https://dadhumor.app" target="_blank" rel="noopener">dadhumor.app</a> — professionally unfunny since 2026.</p>

		<h2>Today's Joke</h2>
		<?php if ( $joke ) : ?>
			<div style="background:#1A1A1A;color:#fff;padding:20px 24px;border-radius:8px;max-width:480px;border:1px solid #333;">
				<p style="color:#A0A0A0;margin:0 0 12px;font-size:1em;"><?php echo esc_html( $joke['setup'] ); ?></p>
				<p style="color:#E3FF00;font-size:1.35em;font-weight:700;margin:0;line-height:1.2;"><?php echo esc_html( $joke['punchline'] ); ?></p>
			</div>
		<?php else : ?>
			<p>Could not fetch today's joke. The API may be temporarily unavailable.</p>
		<?php endif; ?>

		<h2 style="margin-top:2em;">Usage</h2>
		<table class="form-table" style="max-width:600px;">
			<tr><th>Shortcode</th><td><code>[dad_joke]</code></td></tr>
			<tr><th>With options</th><td><code>[dad_joke theme="light" show_category="false" show_link="false"]</code></td></tr>
			<tr><th>Widget</th><td>Appearance → Widgets → "Dad Humor – Daily Joke"</td></tr>
			<tr><th>Block</th><td>Search "Dad Humor" in the Gutenberg block inserter</td></tr>
		</table>

		<h2 style="margin-top:2em;">Cache</h2>
		<p>Jokes are cached for 1 hour. Clear the cache if today's joke isn't showing.</p>
		<form method="post">
			<?php wp_nonce_field( 'dadhumor_clear_cache', 'dadhumor_nonce' ); ?>
			<input type="submit" name="dadhumor_clear_cache" class="button button-secondary" value="Clear cache">
		</form>
	</div>
	<?php
}

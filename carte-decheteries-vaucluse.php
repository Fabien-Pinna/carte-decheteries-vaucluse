<?php

/**
 * Plugin Name:       Carte déchèteries Vaucluse
 * Description:       Une carte interactive des déchèteries du Vaucluse
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Webinf@b
 * License:           GPL-2.0-or-later
 * License URI:       https://webinfab.fr/
 * Text Domain:       carte-decheteries-vaucluse
 */


function create_block_carte_decheteries_vaucluse_block_init()
{
    register_block_type(__DIR__ . '/build');
}
add_action('init', 'create_block_carte_decheteries_vaucluse_block_init');

function decheteries_map_enqueue_scripts()
{
    wp_enqueue_style(
        'mapbox-gl',
        'https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css',
        array(),
        '2.6.1'
    );

    // Enqueue JS
    wp_enqueue_script(
        'decheteries-map-frontend',
        plugins_url('build/frontend.js', __FILE__),
        array('wp-dom-ready', 'wp-element', 'wp-blocks', 'wp-components', 'wp-i18n', 'wp-editor'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'decheteries_map_enqueue_scripts');

function get_mapbox_access_token()
{
    $mapboxAccessToken = defined('REACT_APP_MAPBOX_ACCESS_TOKEN') ? REACT_APP_MAPBOX_ACCESS_TOKEN : '';

    echo json_encode(array('accessToken' => $mapboxAccessToken));
    wp_die();
}
add_action('wp_ajax_get_mapbox_access_token', 'get_mapbox_access_token');
add_action('wp_ajax_nopriv_get_mapbox_access_token', 'get_mapbox_access_token');

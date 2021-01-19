<?php

namespace Tangram\BlogCategory;

/**
 *  Enqueue JavaScript and CSS
 *  for block editor only.
 */
function enqueue_block_editor_assets() {
  $block_path = '/assets/js/editor.blocks.js';
  $style_path = '/assets/css/blocks.editor.css';

  wp_enqueue_script(
    'tangram/detailer/blocks-js',
    _get_plugin_url() . $block_path,
    ['wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor'],
    null
  );

  wp_enqueue_style(
    'tangram/detailer/blocks-editor-css',
    _get_plugin_url() . $style_path,
    [],
    null
  );
}

add_action('enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_block_editor_assets');

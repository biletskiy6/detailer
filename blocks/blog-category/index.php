<?php

namespace DavidYeiser\Detailer\Blocks\BookDetails;

add_action('plugins_loaded', __NAMESPACE__ . '\register_dynamic_block');

function register_dynamic_block() {
  // Only load if Gutenberg is available.
  if (!function_exists('register_block_type')) {
    return;
  }

  // Hook server side rendering into render callback
  // Make sure name matches registerBlockType in ./index.js
  register_block_type('davidyeiser-detailer/blog-category', array(
    'render_callback' => __NAMESPACE__ . '\render_dynamic_block'
  ));
}

function render_dynamic_block($attributes) {
  // Parse attributes
  $category = $attributes['category'];

  ob_start(); // Turn on output buffering

  /* BEGIN HTML OUTPUT */
?>
  <div class="block-details">
      <div class="posts-by-category">
          <?php
          $args = array( 'posts_per_page' => -1, 'category_name' => $category );
          $posts = get_posts( $args );
          ?>
          <?php if($posts): ?>
          <h3>Posts from category:  <?php echo $category; ?></h3>
          <?php foreach ( $posts as $post ): ?>
              <li>
                  <a href="<?php echo get_post_permalink($post->ID) ?>"><?php echo $post->post_title ?></a>
              </li>
          <?php endforeach; ?>
          <?php else: ?>
             <h4> No articles for this category </h4>
          <?php endif; ?>
      </div>
  </div>
<?php
  /* END HTML OUTPUT */

  $output = ob_get_contents(); // collect output
  ob_end_clean(); // Turn off ouput buffer

  return $output; // Print output
}

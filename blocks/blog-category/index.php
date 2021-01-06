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
  $book_details_imageObj = $attributes['image'];
  $book_details_image_url = $book_details_imageObj['sizes']['full']['url'];
  $book_details_image_alt_text = $book_details_imageObj['alt'];
  $book_details_image_width = $book_details_imageObj['sizes']['full']['width'] / 2;

  $book_details_have_read = $attributes['haveRead'];
  $book_details_title = $attributes['title'];
  $book_details_author = $attributes['author'];
  $book_details_summary = $attributes['summary'];
  $book_details_quotes = $attributes['quotes'];
  $category = $attributes['category'];

  ob_start(); // Turn on output buffering

  /* BEGIN HTML OUTPUT */
?>
  <div class="block-book-details">
      <div class="posts-by-category">
          <h3>Posts from category:  <?php echo $category; ?></h3>
          <?php
          $args = array( 'posts_per_page' => -1, 'category_name' => $category );
          $myposts = get_posts( $args );
          foreach ( $myposts as $post ) : setup_postdata( $post ); ?>
              <li>
                  <a href="<?php echo get_post_permalink($post->ID) ?>"><?php echo $post->post_title ?></a>
              </li>
          <?php endforeach; ?>
      </div>
  </div>
<?php
  /* END HTML OUTPUT */

  $output = ob_get_contents(); // collect output
  ob_end_clean(); // Turn off ouput buffer

  return $output; // Print output
}

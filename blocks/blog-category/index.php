<?php

namespace Tangram\BlogCategory\Blocks\BlogCategory;

add_action('plugins_loaded', __NAMESPACE__ . '\register_dynamic_block');

function register_dynamic_block() {
  if (!function_exists('register_block_type')) {
    return;
  }
  register_block_type('tangram-custom/blog-category', array(
    'render_callback' => __NAMESPACE__ . '\render_dynamic_block'
  ));
}

function render_dynamic_block($attributes) {
  $category = $attributes['category'];
  ob_start();
?>
  <div class="block-details">
      <div class="posts-by-category">
          <?php
          $args = array( 'posts_per_page' => -1, 'category_name' => $category );
          $posts = get_posts( $args );
          ?>
          <?php if($posts): ?>
          <ul>
          <?php foreach ( $posts as $post ): ?>
              <li>
                  <a href="<?php echo get_post_permalink($post->ID) ?>"><?php echo $post->post_title ?></a>
              </li>
          <?php endforeach; ?>
          </ul>
          <?php else: ?>
             <h4> There are no articles for "<?php echo $category ?>" category: </h4>
          <?php endif; ?>
      </div>
  </div>
<?php
  $output = ob_get_contents();
  ob_end_clean();

  return $output;
}

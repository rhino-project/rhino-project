# frozen_string_literal: true

module SegmentHelper
  module_function

  def track_new_blog_post(blog_post)
    Analytics.track(
      event: "BlogPost Created",
      user_id: blog_post.blog.user.id,
      properties: {
        blog_post_owner: blog_post.blog.user.email,
        blog_post_id: blog_post.id,
        blog_post_title: blog_post.title,
        blog_post_body: blog_post.body
      }
    )
  rescue StandardError => e
    Rollbar.error(e)
  end
end

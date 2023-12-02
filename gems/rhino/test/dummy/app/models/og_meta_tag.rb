# frozen_string_literal: true

class OgMetaTag < ApplicationRecord
  belongs_to :blog_post

  rhino_owner :blog_post
  rhino_references [{ blog_post: [:blog] }]
  rhino_search([], { blog_post: %i[title] })

  validates :tag_name, presence: true
  validates :value, presence: true

  def display_name
    "#{tag_name}: #{value}"
  end
end

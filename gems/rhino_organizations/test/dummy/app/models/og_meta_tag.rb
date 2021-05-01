# frozen_string_literal: true

class OgMetaTag < ApplicationRecord
  belongs_to :blog_post
  belongs_to :og_tag

  rhino_owner :blog_post
  rhino_references [{ blog_post: [:blog] }, :og_tag]

  validates :og_tag, presence: true
  validates :value, presence: true

  def display_name
    "#{og_tag.name}:#{value}"
  end
end

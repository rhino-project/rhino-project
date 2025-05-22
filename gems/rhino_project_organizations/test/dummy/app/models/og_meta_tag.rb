# frozen_string_literal: true

class OgMetaTag < ApplicationRecord
  attribute :display_name, :string

  belongs_to :blog_post
  belongs_to :og_tag

  rhino_owner :blog_post
  rhino_property_canonical :display_name, order: "og_tag.name,value"
  rhino_references [{ blog_post: [:blog] }, :og_tag]

  validates :value, presence: true

  def display_name
    "#{og_tag.name}:#{value}"
  end
end

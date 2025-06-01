# frozen_string_literal: true

class OgMetaTag < ApplicationRecord
  attribute :tag_and_value, :string

  belongs_to :blog_post
  belongs_to :og_tag

  rhino_owner :blog_post
  rhino_property_canonical :tag_and_value, order: "og_tag.name,value"
  rhino_properties_write except: :tag_and_value
  rhino_references [{ blog_post: [:blog] }, :og_tag]

  validates :value, presence: true

  def tag_and_value
    "#{og_tag.name}:#{value}"
  end
end

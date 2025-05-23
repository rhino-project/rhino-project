# frozen_string_literal: true

class OgMetaTag < ApplicationRecord
  attribute :tag_and_value, :string

  belongs_to :blog_post

  rhino_owner :blog_post
  rhino_property_canonical :tag_and_value, order: "tag_name,value"
  rhino_properties_write except: :tag_and_value
  rhino_references [{ blog_post: [:blog] }]
  rhino_search([], { blog_post: %i[title] })

  validates :tag_name, presence: true
  validates :value, presence: true

  def tag_and_value
    "#{tag_name}:#{value}"
  end
end

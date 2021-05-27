# frozen_string_literal: true

class BlogsCategory < ApplicationRecord
  belongs_to :blog
  belongs_to :category

  rhino_owner :blog
  rhino_references %i[blog category]

  validates :category, uniqueness: { scope: :blog }

  delegate :display_name, to: :category
end

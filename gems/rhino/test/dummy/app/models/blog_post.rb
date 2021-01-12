# frozen_string_literal: true

class BlogPost < ApplicationRecord
  belongs_to :blog

  rhino_owner :blog
  rhino_references %i[blog]

  validates :title, presence: true
  validates :body, presence: true
end

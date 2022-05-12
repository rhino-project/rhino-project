# frozen_string_literal: true

class BlogDummy < ApplicationRecord
  rhino_owner :blog
  rhino_references [:blog]
  rhino_controller :blog_dummies
  rhino_policy :blog_dummy

  belongs_to :blog, optional: true
end

# frozen_string_literal: true

class Blog < ApplicationRecord
  belongs_to :user

  has_many :blogs_categories, dependent: :destroy
  has_many :categories, through: :blogs_categories

  accepts_nested_attributes_for :blogs_categories, allow_destroy: true

  has_many :blog_posts, dependent: :destroy

  has_one_attached :banner

  rhino_owner_base
  rhino_references [:user, {blogs_categories: %i[blog category]}, :banner_attachment, :blog_posts]
  rhino_properties_format blogs_categories: :join_table_simple
  rhino_search [:title]

  validates :title, presence: true
end

# frozen_string_literal: true

class Blog < ApplicationRecord
  belongs_to :user

  # NUB-347
  belongs_to :category, optional: true, foreign_key: :category_id

  has_many :blog_posts, dependent: :destroy

  has_one_attached :banner

  rhino_owner_base
  rhino_references %i[user category banner_attachment blog_posts]
  rhino_search [:title]

  validates :title, presence: true
end

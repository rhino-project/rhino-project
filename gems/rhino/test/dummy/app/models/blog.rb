# frozen_string_literal: true

class Blog < ApplicationRecord
  belongs_to :user
  belongs_to :category, optional: true
  has_many :blog_posts, dependent: :destroy

  has_one_attached :banner

  rhino_owner_base
  rhino_references %i[user banner_attachment blog_posts]

  validates :title, presence: true
end

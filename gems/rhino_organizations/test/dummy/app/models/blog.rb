# frozen_string_literal: true

class Blog < ApplicationRecord
  belongs_to :organization
  belongs_to :author, default: -> { Rhino::Current.user }, class_name: "User", foreign_key: :user_id

  belongs_to :category, optional: true
  has_many :blog_posts, dependent: :destroy

  has_one_attached :banner

  rhino_owner_base
  rhino_references %i[author organization category banner_attachment blog_posts]
  rhino_properties_write except: :author
  rhino_search [:title]

  validates :title, presence: true
end

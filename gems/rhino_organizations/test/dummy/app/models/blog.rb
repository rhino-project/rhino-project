# frozen_string_literal: true

class Blog < ApplicationRecord
  belongs_to :organization
  # FIXME: This should be
  # belongs_to :author, class_name: 'User', foreign_key: :user_id
  belongs_to :user, default: -> { Rhino::Current.user }

  belongs_to :category, optional: true
  has_many :blog_posts, dependent: :destroy

  has_one_attached :banner

  rhino_owner_base
  rhino_references %i[user organization category banner_attachment blog_posts]
  rhino_properties_create except: [:user]
  rhino_properties_update except: [:user]
  rhino_search [:title]

  validates :title, presence: true
end

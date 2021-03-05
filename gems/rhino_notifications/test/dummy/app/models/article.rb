# frozen_string_literal: true

class Article < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :commented_users, through: :comments, source: :user

  rhino_owner_base
  rhino_references [:user]

  acts_as_notification_group
end

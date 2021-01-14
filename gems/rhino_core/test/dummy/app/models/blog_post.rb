# frozen_string_literal: true

class BlogPost < ApplicationRecord
  belongs_to :blog
  has_many :og_meta_tags, dependent: :destroy

  accepts_nested_attributes_for :og_meta_tags, allow_destroy: true

  acts_as_taggable_on :tags

  rhino_owner :blog
  rhino_references %i[blog og_meta_tags]

  validates :title, presence: true
  validates :body, presence: true
end

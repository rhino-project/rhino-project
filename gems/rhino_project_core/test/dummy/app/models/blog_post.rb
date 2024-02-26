# frozen_string_literal: true

class BlogPost < ApplicationRecord
  enum status: { draft: 0, active: 10, archived: 20 }, _prefix: :status

  belongs_to :blog
  has_many :og_meta_tags, dependent: :destroy

  has_many_attached :image

  accepts_nested_attributes_for :og_meta_tags, allow_destroy: true

  acts_as_taggable_on :tags

  rhino_owner :blog
  rhino_references %i[blog og_meta_tags image_attachments]

  validates :title, presence: true
  validates :body, presence: true

  after_create_commit :track_creation

  default_scope { order(created_at: :desc) }

  alias_attribute :aliased_creation_date, :created_at

  private
    def track_creation
      SegmentHelper.track_new_blog_post(self)
    end
end

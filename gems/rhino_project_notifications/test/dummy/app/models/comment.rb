# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :article
  belongs_to :user

  rhino_owner :article
  rhino_references %i[article user]

  acts_as_notifiable :users,
                     targets: lambda { |comment, _key|
                       ([comment.article.user] + comment.article.reload.commented_users.to_a).uniq
                     },
                     group: :article,
                     tracked: { only: [:create] },
                     dependent_notifications: :update_group_and_destroy,
                     notifiable_path: :comment_notifiable_path,
                     printable_name: :comment_printable_name,
                     action_cable_api_allowed: true,
                     parameters: { article_id: :article_id }

  def comment_notifiable_path
    route_frontend
  end

  def comment_printable_name
    "Comments on #{article.title}"
  end
end

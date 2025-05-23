# frozen_string_literal: true

class DelegatedTypeEntry < ApplicationRecord
  belongs_to :user

  delegated_type :entryable, types: %w[DelegatedTypeMessage DelegatedTypeComment], dependent: :destroy

  rhino_owner_base
  rhino_references %i[user entryable]

  accepts_nested_attributes_for :entryable
end

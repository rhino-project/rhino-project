# frozen_string_literal: true

class DelegatedTypeComment < ApplicationRecord
  include DelegatedTypeEntryable

  has_one :user, through: :delegated_type_entry

  rhino_owner_base
  rhino_references %i[user]
end

# frozen_string_literal: true

class EveryFieldDummy < ApplicationRecord
  rhino_owner_base
  rhino_references [:user]

  belongs_to :user
end

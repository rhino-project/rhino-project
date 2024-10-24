# frozen_string_literal: true

class EveryFieldDummy < ApplicationRecord
  belongs_to :user

  rhino_owner_base
  rhino_references [:user]
end

# frozen_string_literal: true

class AlternatePrimaryKey < ApplicationRecord
  belongs_to :user

  rhino_owner_base
  rhino_references %i[ user ]
end

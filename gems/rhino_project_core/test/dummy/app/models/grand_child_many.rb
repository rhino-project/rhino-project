# frozen_string_literal: true

class GrandChildMany < ApplicationRecord
  belongs_to :child_many

  rhino_owner :child_many
  rhino_references [:child_many]
end

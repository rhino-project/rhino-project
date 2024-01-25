# frozen_string_literal: true

class GrandChildOne < ApplicationRecord
  belongs_to :child_one

  rhino_owner :child_one
  rhino_references [:child_one]
end

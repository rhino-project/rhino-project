# frozen_string_literal: true

class ResourceChild < ApplicationRecord
  belongs_to :resource

  rhino_owner :resource
  rhino_references [:resource]
end

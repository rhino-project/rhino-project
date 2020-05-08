# frozen_string_literal: true

class ResourceChild < ApplicationRecord
  include Rhino::Resource::ActiveRecord

  belongs_to :resource

  rhino_owner :resource
  rhino_references [:resource]
end

# frozen_string_literal: true

class ResourceParent < ApplicationRecord
  include Rhino::Resource::ActiveRecord

  has_many :resources

  rhino_owner_base
end

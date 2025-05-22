# frozen_string_literal: true

class ActiveRecordTreeDummy < ApplicationRecord
  include Rhino::Resource::ActiveRecordTree

  rhino_property_canonical :id
end

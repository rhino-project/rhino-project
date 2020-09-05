# frozen_string_literal: true

class PropertyResource < ApplicationRecord
  rhino_owner_global
  rhino_properties_read only: %i[prop_one prop_two prop_three]
  rhino_properties_create except: [:prop_one]
end

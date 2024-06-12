# frozen_string_literal: true

class Geospatial < ApplicationRecord
  belongs_to :user

  rhino_owner_base
  rhino_references %i[user]

  reverse_geocoded_by :latitude, :longitude
end

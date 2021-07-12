# frozen_string_literal: true

module Rhino
  class Role < ApplicationRecord
    self.abstract_class = true

    rhino_owner_global
  end
end

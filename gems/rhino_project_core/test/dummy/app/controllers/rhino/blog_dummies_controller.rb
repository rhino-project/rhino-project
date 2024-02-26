# frozen_string_literal: true

module Rhino
  class BlogDummiesController < CrudController
    def create
      raise "_wrapper_options.name should be :crud" if _wrapper_options.name != :crud

      @model = authorize klass.new(permit_and_transform(klass))
      @model.save!

      permit_and_render
    end
  end
end

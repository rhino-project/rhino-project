# frozen_string_literal: true

ActiveAdmin.register Organization do
  rhino_filters
  rhino_permit_params
end

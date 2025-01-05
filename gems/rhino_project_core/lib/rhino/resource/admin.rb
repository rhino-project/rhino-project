# frozen_string_literal: true

module Rhino
  module Resource
    module Admin
      module_function

      def register(resource, options = {}, &block)
        ActiveAdmin.register resource, options do
          resource.ransackable_filters.each do |attr|
            filter attr.to_sym
          end

          permit_params do
            permitted = []

            permitted = resource.creatable_properties.map(&:to_sym) if params[:action] == "create"
            permitted = resource.updatable_properties.map(&:to_sym) if params[:action] == "update"

            # Allow owner and other references to be assigned or changed by admin
            # All possible relations
            references = resource.describe[:properties].select { |_p, d| d[:type] == :reference }.keys

            # Restrict to the valid create/update properties
            references.select! { |r| permitted.include?(r.to_sym) }
            permitted += references.map { |r| m.reflections[r].foreign_key }

            permitted.uniq
          end

          instance_eval(&block) if block
        end
      end
    end
  end
end

# frozen_string_literal: true

require "active_admin/resource_dsl"

module ActiveAdmin
  # This is the class where all the register blocks are evaluated.
  class ResourceDSL
    # Runs in the context of the ResourceDSL
    def rhino_filters
      klass = self.config.resource_class_name.constantize
      klass.ransackable_filters.each do |attr|
        filter attr.to_sym
      end
    end

    # Runs in the context of the controller
    def rhino_permit_params(permitted: [])
      permit_params do
        klass = self.active_admin_config.resource_class_name.constantize

        permitted += klass.creatable_properties.map(&:to_sym) if params[:action] == "create"
        permitted += klass.updatable_properties.map(&:to_sym) if params[:action] == "update"

        # Allow owner and other references to be assigned or changed by admin
        # All possible relations
        references = klass.describe[:properties].select { |_p, d| d[:type] == :reference }.keys

        # Restrict to the valid create/update properties
        references.select! { |r| permitted.include?(r.to_sym) }
        permitted += references.map { |r| klass.reflections[r].foreign_key }

        permitted.uniq
      end
    end
  end
end

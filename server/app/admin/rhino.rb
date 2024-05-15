# frozen_string_literal: true

Rhino.resource_classes.each do |m|
  ActiveAdmin.register m do
    permit_params do
      permitted = []

      permitted = m.creatable_properties.map(&:to_sym) if params[:action] == "create"
      permitted = m.updatable_properties.map(&:to_sym) if params[:action] == "update"

      # Allow owner and other references to be assigned or changed by admin
      # All possible relations
      references = m.describe[:properties].select { |_p, d| d[:type] == :reference }.keys

      # Restrict to the valid create/update properties
      references.select! { |r| permitted.include?(r.to_sym) }
      permitted += references.map { |r| m.reflections[r].foreign_key }

      permitted.uniq
    end
  end
end

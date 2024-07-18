# frozen_string_literal: true

Rhino.resource_classes.filter { |rc| rc.ancestors.include?(ActiveRecord::Base) }.each do |m|
  ActiveAdmin.register m do
    # Give a reasonable experience out of the box by only using designated fields
    if m.respond_to?(:ransackable_filters)
      m.ransackable_filters.each do |attr|
        filter attr.to_sym
      end
    end

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

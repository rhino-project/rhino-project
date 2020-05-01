# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveRecord
      module Params
        extend ActiveSupport::Concern

        class_methods do # rubocop:disable Metrics/BlockLength
          def create_params
            writeable_params('create')
          end

          def update_params
            writeable_params('update')
          end

          def transform_create_params(params)
            params.transform_keys do |param_key|
              association = reflect_on_association(param_key)

              # Its a regular attribute
              next param_key unless association

              # FIXME
              # Hack to rewrite for attachment
              next param_key.remove('_attachment') if param_key.end_with?('_attachment')

              # Nested need _attributes - we don't want the client to have to do that
              next "#{param_key}_attributes" if association.macro == :has_many

              association.foreign_key
            end
          end

          def transform_update_params(params)
            transform_create_params(params)
          end

          protected

          # FIXME: This should be renamed about params
          def writeable_params(type) # rubocop:disable Metrics/AbcSize
            # Direct attributes for this model
            attrs = send("#{type}_properties")

            references.each do |r|
              name = r.is_a?(Hash) ? r.keys.first : r
              association = reflect_on_association(name)

              next attrs << name.to_s if %i[has_one belongs_to].include?(association.macro)

              next unless nested_attributes_options.key?(name)

              options = nested_attributes_options[name]
              ref = name.to_s.classify.constantize
              destroy = [*('_destroy' if options[:allow_destroy])]

              # The identifier_property (primary key) is editable so that updates can occur
              # The nested association editable attributes are editable
              # The nested attributes of the nested association are also editable
              # FIXME: Do we need to handle :update_only option?
              attrs << { name.to_s => [ref.identifier_property] + ref.send("#{type}_params").reject { |wa| wa.is_a?(Hash) } + destroy }
            end

            attrs
          end
        end
      end
    end
  end
end

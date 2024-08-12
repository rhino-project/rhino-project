# frozen_string_literal: true

require "rails/generators"
require "rails/generators/active_record/model/model_generator"
require "rails/generators/active_record/migration/migration_generator"

module Rhino
  class ModelGenerator < ::ActiveRecord::Generators::ModelGenerator
    source_root File.expand_path("templates", __dir__)

    class_option :owner, type: :string, desc: "The model is owned by the reference attribute", group: :owner
    class_option :base_owner, type: :boolean, default: false, desc: "The model is owned by the base owner", group: :owner
    class_option :global_owner, type: :boolean, default: false, desc: "The model is globally owned", group: :owner

    # Parent source paths
    def source_paths
      [
        File.expand_path("templates", __dir__),
        ::ActiveRecord::Generators::ModelGenerator.source_root,
        ::ActiveRecord::Generators::MigrationGenerator.source_root
      ]
    end

    def create_migration_file
      # We check the ownership of the reference attributes before creating the migration
      check_ownership

      super
    end

    def inject_into_rhino_initializer
      # FIXME: Can we do better on indentation?
      inject_into_file "config/initializers/rhino.rb", before: /^end\s*$/ do
        "  config.resources += ['#{class_name}']\n"
      end
    end

    def inject_rhino_owner_into_model
      # Write 'rhino_owner :<attribute name>' to the model file
      model_file = File.join("app/models", "#{file_path}.rb")

      # FIXME: Can we do better on indentation?
      inject_into_file model_file, before: /^end\s*$/ do
        "\n  #{owner_call}\n"
      end

      # Global owned don't need a reference
      return if global_owner?

      inject_into_file model_file, after: /#{owner_call}/ do
        "\n  rhino_references %i[#{owner_name}]"
      end
    end

    protected
      def check_ownership
        raise Thor::Error, "Exactly one owner must be defined on a reference or globally" unless base_owner? ^ global_owner? ^ reference_owner?

        return if global_owner? || reference_attributes.find { |attr| attr.name == owner_name }

        raise Thor::Error, "The owner attribute must be a reference attribute"
      end

    private
      def global_owner?
        @global_owner = options[:global_owner]
      end

      def base_owner?
        @global_owner = options[:base_owner] || Rhino.base_owner.model_name.singular == options[:owner]
      end

      def reference_owner?
        @reference_owner = options[:owner].present? && !base_owner?
      end

      def owner_name
        @owner_name ||= if global_owner?
          "global"
        elsif base_owner?
          Rhino.base_owner.model_name.singular
        else
          options[:owner]
        end
      end

      def owner_call
        return "rhino_owner_global" if global_owner?
        return "rhino_owner_base" if base_owner?

        "rhino_owner :#{owner_name}"
      end

      def reference_attributes
        @reference_attributes ||= attributes.filter(&:reference?)
      end
  end
end

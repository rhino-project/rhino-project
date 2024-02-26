# frozen_string_literal: true

module Rhino
  class PolicyGenerator < ::Rails::Generators::NamedBase
    source_root File.expand_path("templates", __dir__)

    class_option :parent, type: :string, default: "Rhino::ViewerPolicy", desc: "The parent class for the policy"

    check_class_collision suffix: "Policy"

    hook_for :test_framework, as: :rhino_policy

    def create_policy_file
      template "policy.rb", File.join("app/policies", class_path, "#{file_name}_policy.rb")
    end

    private
      def parent_class_name
        # FIXME: Does this really need to be top level namespaced?
        return options[:parent] if options[:parent].starts_with?("::")

        "::#{options[:parent]}"
      end

      def parent_scope_class_name
        "#{parent_class_name}::Scope"
      end

      def file_name
        @file_name ||= super.sub(/_policy\z/i, "")
      end
  end
end

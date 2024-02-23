# frozen_string_literal: true

# correction for nested forms errors indexation
# this correction is still necessary in rails 7.0
module ActiveRecord::DelegatedType
  def delegated_type(role, types:, **options)
    belongs_to role, options.delete(:scope), **options.merge(polymorphic: true)
    define_delegated_type_methods(role, types:, options:)

    define_singleton_method "#{role}_types" do
      types.map(&:to_s)
    end
  end
end

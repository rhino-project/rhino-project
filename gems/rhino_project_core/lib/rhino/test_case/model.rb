# frozen_string_literal: true

module Rhino
  module TestCase
    class ModelTest < ActiveSupport::TestCase
      protected
        def assert_required(attribute)
          instance = @model.new
          instance[attribute] = nil
          assert instance.invalid?
          assert_includes instance.errors.messages[attribute], "can't be blank", ":#{attribute} should be required"
        end

        def assert_not_required(attribute)
          instance = build factory
          instance[attribute] = nil
          assert instance.valid?, ":#{attribute} should not be required, got errors: #{instance.errors.full_messages}"
        end

        def assert_association_required(association)
          instance = @model.new
          instance.send("#{association}_id=", nil)
          assert instance.invalid?
          assert_includes instance.errors.messages[association], "must exist", ":#{association} should be required"
        end

        def assert_uniqueness(attribute, scope: nil)
          instance = create factory
          duplicate = build factory, attribute => instance[attribute]
          duplicate.send("#{scope}=", instance.send(scope)) if scope.present?
          assert duplicate.invalid?, "Should be invalid with duplicate #{attribute}"
          assert_includes duplicate.errors.messages[attribute], "has already been taken", ":#{attribute} should be unique"
        end

        # association_model is a symbol
        def assert_accepts_nested_attributes_for(association_model, association_factory: association_model) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/PerceivedComplexity
          association = @model.reflect_on_association(association_model)

          assert association.present?, "association :#{association_model} not found"

          key = if association.macro == :belongs_to || association.macro == :has_one
            "#{association_model}_attributes"
          else
            "#{association_model.to_s.pluralize}_attributes"
          end

          success_checker = if association.macro == :belongs_to || association.macro == :has_one
            ->(instance) { instance.reload.send(association_model).present? }
          else
            ->(instance) { instance.reload.send(association_model).any? }
          end

          assert @model.new.respond_to?("#{key}="),
                 "#{@model} doesn't have a #{key} setter method. Probably there's no `accepts_nested_attributes_for :#{association_model}` in #{@model}" # rubocop:disable Layout/LineLength
          object = if association_factory.is_a?(Proc)
            model_instance = build factory
            association_instance = association_factory.call model_instance
            model_instance.send("#{key}=", association_instance.attributes)
            model_instance
          else
            build factory, { key => build(association_factory).attributes }
          end
          assert object.valid?, "Should be valid after assigning nested model attributes, but got errors: #{object.errors.full_messages}"
          assert object.save, "Should be able to save after assigning nested model attributes, but got errors: #{object.errors.full_messages}"
          assert success_checker.call(object), "Should have a #{association_model} after assigning nested model attributes"
        end

        def assert_destroy_association_cascade(association_model, association_factory: association_model) # rubocop:disable Metrics/AbcSize
          instance = create factory
          association_instance = if association_factory.is_a?(Proc)
            association_factory.call(instance)
          else
            create association, { @model.to_s.underscore => instance }
          end
          assert instance.reload.send(association_model).any?, "Should have a #{association_model} after creating #{@model}"
          assert instance.destroy, "Should be able to destroy #{@model}"
          assert_not association_instance.class.exists?(association_instance.id), "Should destroy #{association_model} when destroying #{@model}"
        end

      private
        def factory
          @factory ||= @model.to_s.underscore.to_sym
        end
    end
  end
end

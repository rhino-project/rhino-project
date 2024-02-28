# frozen_string_literal: true

module Rhino
  module TestCase
    class OrganizationControllerPolicyTest < OrganizationControllerTest
      protected
        def sign_in_org_users_and_resource(role = "admin", resource = :blog)
          sign_in_with_organization(role)

          @resource_class = resource.to_s.classify.safe_constantize
          @resource_collection_route = "#{@resource_class.model_name.route_key}_path"
          @resource_singular_route = "#{@resource_class.model_name.singular_route_key}_path"
          @resource = create resource, organization: @current_organization
          @another_resource = create resource
        end

        def policy_index_success(expected_results = [@resource])
          get_api send(@resource_collection_route)

          assert_response_ok
          assert_equal expected_results.count, parsed_response["total"]
          expected_results.each_with_index { |result, idx| assert_equal result.title, parsed_response["results"][idx]["title"] }
        end

        def policy_show_success(resource = @resource)
          get_api send(@resource_singular_route, resource)

          assert_response_ok
          assert_equal resource.id, parsed_response["id"]
          assert_equal resource.title, parsed_response["title"]
        end

        def policy_show_fail(resource = @resource)
          get_api send(@resource_singular_route, resource)

          assert_response_not_found
        end

        def policy_create_success(create_attributes)
          assert_difference "#{@resource_class}.count" do
            post_api send(@resource_collection_route), params: create_attributes
          end

          assert_response_ok
        end

        def policy_create_fail(create_attributes)
          assert_no_difference "#{@resource_class}.count" do
            post_api send(@resource_collection_route), params: create_attributes
          end

          assert_response_forbidden
        end

        def policy_update_success(update_attributes, resource = @resource)
          patch_api send(@resource_singular_route, resource), params: update_attributes

          assert_response_ok
        end

        def policy_update_fail(update_attributes, resource = @resource)
          patch_api send(@resource_singular_route, resource), params: update_attributes

          assert_response_forbidden
        end

        def policy_destroy_success(resource = @resource)
          assert_difference "#{@resource_class}.count", -1 do
            delete_api send(@resource_singular_route, resource)
          end

          assert_response_ok
        end

        def policy_destroy_fail(resource = @resource)
          assert_no_difference "Blog.count" do
            delete_api send(@resource_singular_route, resource)
          end

          assert_response_forbidden
        end
    end
  end
end

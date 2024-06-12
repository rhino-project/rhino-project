# frozen_string_literal: true

module Rhino
  module TestCase
    # rubocop:disable Metrics/ClassLength
    class ControllerTest < ActionDispatch::IntegrationTest
      def setup
        DeviseTokenAuth.cookie_attributes[:secure] = false
        DeviseTokenAuth.cookie_attributes[:domain] = :all
      end

      protected
        def users_index(params: {}, headers: {})
          get "/api/users", params:, headers:
        end

        def validate_session(params: {}, headers: {})
          get "/api/auth/validate_token", params:, headers:
        end

        def sign_out_with_empty_auth_cookie
          params = {}
          headers = { "Cookie" => "auth_cookie=;" }
          delete "/api/auth/sign_out", params:, headers:
        end

        def sign_out(params: {}, headers: {})
          delete "/api/auth/sign_out", params:, headers:
        end

        def get_api(path, params: {}, headers: {})
          get path, params:, headers:, xhr: true, as: :json
        end

        def post_api(path, params: {})
          post path, params:, xhr: true, as: :json
        end

        def patch_api(path, params: {}, headers: {})
          patch path, params:, xhr: true, as: :json, headers:
        end

        def put_api(path, params: {})
          put path, params:, xhr: true, as: :json
        end

        def delete_api(path)
          delete path, xhr: true, as: :json
        end

        def head_api(path)
          head path, xhr: true, as: :json
        end

        def assert_response_ok
          assert_equal 200, response.status
        end

        def assert_response_bad_request
          assert_equal 400, response.status
        end

        def assert_response_unauthorized
          assert_equal 401, response.status
        end

        def assert_response_forbidden
          assert_equal 403, response.status
        end

        def assert_response_not_found
          assert_equal 404, response.status
        end

        def assert_response_unprocessable
          assert_equal 422, response.status
        end

        def assert_deleted_cookie(cookie_name)
          assert response.cookies.key?(cookie_name)
          assert_nil response.cookies[cookie_name]
        end

        def assert_not_deleted_cookie(cookie_name)
          has_cookie = response.cookies.key?(cookie_name)
          cookie_not_blank = response.cookies[cookie_name].present?
          assert !has_cookie || cookie_not_blank, "Response should either not have the auth cookie present or it should be set to something. Current value is #{response.cookies[cookie_name]}" # rubocop:disable Layout/LineLength
        end

        def sign_in(user = nil)
          @current_user = user || create(:user)
          post "/api/auth/sign_in", params: {
            email: @current_user.email,
            password: @current_user.password
          }, as: :json
          assert_response_ok
          headers = response.headers
          # Use the configured header names
          assert headers[DeviseTokenAuth.headers_names[:"access-token"]]
        end

        def parsed_response_ids
          parsed_response.fetch("results", []).map { |result| result["id"] }
        end

        def parsed_response
          JSON.parse response.body
        end

        def parsed_auth_cookie_header
          JSON.parse(cookies[DeviseTokenAuth.cookie_name])
        end

        def empty_auth_cookie_header
          { "Cookie" => "auth_cookie=;" }
        end

        def current_access_token
          parsed_auth_cookie["access-token"]
        end

        def delete_user_tokens(user = nil)
          (user || @current_user).reload.update tokens: {}
        end

        def serialized_user(user = @current_user)
          {
            "id" => user.id,
            "provider" => "email",
            "uid" => user.email,
            "name" => user.name,
            "nickname" => user.nickname,
            "image" => user.image,
            "email" => user.email,
            "allow_password_change" => false,
            "approved" => true
          }
        end
    end
    # rubocop:enable Metrics/ClassLength
  end
end

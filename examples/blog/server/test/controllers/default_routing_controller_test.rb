# frozen_string_literal: true

require "test_helper"

class DefaultRoutingControllerTest < ActionDispatch::IntegrationTest
  %i[get delete patch post put].each do |request|
    test "root via #{request} redirects to frontend" do
      send(request, "/")

      assert_redirected_to ENV["FRONT_END_URL"]
    end
  end
end

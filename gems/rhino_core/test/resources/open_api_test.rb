# frozen_string_literal: true

require 'test_helper'

class OpenApiTest < ActiveSupport::TestCase
  test 'Description is Open API compliant' do
    assert_not Openapi3Parser.load(Rhino::ResourceInfo.index).valid?
  end
end

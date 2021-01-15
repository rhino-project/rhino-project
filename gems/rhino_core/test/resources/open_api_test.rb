# frozen_string_literal: true

require 'test_helper'

class OpenApiTest < ActiveSupport::TestCase
  test 'Description is Open API compliant' do
    assert Openapi3Parser.load(Rhino::OpenApiInfo.index).valid?
  end
end

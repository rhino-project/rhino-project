# frozen_string_literal: true

require "test_helper"

class ParamsTest < ActiveSupport::TestCase
  class NoParams
    include Rhino::Resource
  end

  %w[create update show].each do |param|
    test "raises error if #{param}_params is not implemented" do
      exp = assert_raises NotImplementedError do
        NoParams.send("#{param}_params")
      end
      assert_equal("##{param}_params is not implemented", exp.message)
    end
  end
end

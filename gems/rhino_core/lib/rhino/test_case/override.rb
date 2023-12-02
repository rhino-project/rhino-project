# frozen_string_literal: true

module Rhino
  module TestHelperOverride
    def assert_overridden(overriding, klass, *methods)
      methods.each do |method|
        assert_equal File.realpath(overriding), klass.new.method(method).source_location[0]
      end
    end
  end
end

module Rhino
  module TestCase
    class Override < ActiveSupport::TestCase
      include Rhino::TestHelperOverride
    end
  end
end

# frozen_string_literal: true

module Rhino
  module Sieve
    class Helpers
      def self.real_column_name(scope, column_name)
        scope.attribute_aliases[column_name] || column_name
      end
    end
  end
end

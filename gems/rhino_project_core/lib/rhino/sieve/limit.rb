# frozen_string_literal: true

module Rhino
  module Sieve
    class Limit
      attr_accessor :default_limit, :max_limit

      def initialize(app, default_limit: 20, max_limit: 100)
        @app = app

        @default_limit = default_limit
        @max_limit = max_limit
      end

      # limit=20
      def resolve(scope, params)
        # If we get a non-nil limit param we try and construct it as an integer
        # Otherwise we use the default
        param_limit = params[:limit].nil? ? default_limit : params[:limit].to_i

        # Don't allow a limit above the max_limit
        @app.resolve(scope.limit([param_limit, max_limit].min), params)
      end
    end
  end
end

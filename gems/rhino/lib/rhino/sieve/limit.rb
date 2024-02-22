# frozen_string_literal: true

module Rhino
  module Sieve
    class Limit
      attr_accessor :default_limit

      def initialize(app, default_limit: 20)
        @app = app

        @default_limit = default_limit
      end

      # limit=20
      def resolve(scope, params)
        @app.resolve(scope.limit(params[:limit] || default_limit), params)
      end
    end
  end
end

# frozen_string_literal: true

module Rhino
  module Sieve
    class Offset
      def initialize(app)
        @app = app
      end

      # offset=20
      def resolve(scope, params)
        @app.resolve(scope.offset(params[:offset]), params)
      end
    end
  end
end

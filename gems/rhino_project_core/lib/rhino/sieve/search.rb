# frozen_string_literal: true

module Rhino
  module Sieve
    class Search
      def initialize(app)
        @app = app
      end

      # search='test'
      def resolve(scope, params)
        return @app.resolve(scope, params) unless scope.respond_to?(:search_text_fields) && params[:search].present?

        # Re-order so that rank isn't the default
        # FIXME: Should look at the order param for 'rank'
        @app.resolve(scope.search_text_fields(params[:search]).reorder(''), params)
      end
    end
  end
end

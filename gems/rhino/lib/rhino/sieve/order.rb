# frozen_string_literal: true

module Rhino
  module Sieve
    class Order
      def initialize(app)
        @app = app
      end

      # order=name
      def resolve(scope, params)
        order = if params[:order]
                  "#{scope.table_name}.#{params[:order]}"
                else
                  nil
                end

        @app.resolve(scope.order(order), params)
      end
    end
  end
end

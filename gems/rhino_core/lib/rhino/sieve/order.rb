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
                  if params[:order][0] == '-'
                    "#{scope.table_name}.#{params[:order][1..]} desc"
                  else
                    "#{scope.table_name}.#{params[:order]}"
                  end
                else
                  nil
                end

        @app.resolve(scope.order(order), params)
      end
    end
  end
end

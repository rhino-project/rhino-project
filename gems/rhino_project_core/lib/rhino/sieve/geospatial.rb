# frozen_string_literal: true

module Rhino
  module Sieve
    class Geospatial
      def initialize(app)
        @app = app
      end

      # geospatial={near: {location: { latitude: 41.2565, longitude: -95.9345 }, max_distance: 10, units: 'km'}}
      # geospatial={near: {location: 'Omaha, NE, US', max_distance: 10, units: 'km'}}
      def resolve(scope, params)
        return @app.resolve(scope, params) unless valid?(params)

        @app.resolve(
          scope.near(
            @location_params,
            @near_params[:max_distance],
            units: @near_params[:units]
          ), params
        )
      end

      private
        def valid?(params) # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
          @geospatial_params = params[:geospatial]
          return false unless @geospatial_params.is_a?(ActionController::Parameters)

          @near_params = @geospatial_params[:near]
          return false unless @near_params.is_a?(ActionController::Parameters)

          @location_params = @near_params[:location]
          if @location_params.is_a?(String)
            @location_params = @near_params[:location]
          elsif @location_params.is_a?(ActionController::Parameters) && @location_params[:latitude].present? && @location_params[:longitude].present?
            @location_params = [@location_params[:latitude], @location_params[:longitude]]
          else
            return false
          end

          @near_params[:max_distance].present?
        end
    end
  end
end

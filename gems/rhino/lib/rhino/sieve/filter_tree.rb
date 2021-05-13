# frozen_string_literal: true

module Rhino
  module Sieve
    class FilterTree < Rhino::Sieve::Filter
      private
      def apply_filters(objects, base, filter) # rubocop:disable Metrics/AbcSize
        filter.each do |key, val|
          if val.is_a?(Hash) && base.reflections[key.to_s]
            # joined table filter
            bs = base.reflections[key.to_s].klass
            objects = apply_filters(objects, bs, val)
          else
            parts = key.split('::')
            next unless parts[1] == 'tree'

            # We get the ancestry tree navigator such as 'subtree' or 'descendants'
            # Then we get those ids and plug them into the main query
            # FIXME: Is there any sort of security hole here?
            subquery = base.where(parts[0] => val).map(&parts[2].to_sym).flatten.map(&parts[0].to_sym)
            objects = objects.where(base.table_name => { parts[0] => subquery })
          end
        end
        objects
      end
    end
  end
end

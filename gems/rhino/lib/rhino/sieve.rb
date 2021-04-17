# frozen_string_literal: true

module Rhino
  module Sieve
    extend ActiveSupport::Autoload

    autoload :Filter
    autoload :FilterTree
    autoload :Limit
    autoload :Offset
    autoload :Order
    autoload :Search
  end

  class SieveStack
    class Sieve
      attr_reader :args, :block, :klass

      def initialize(klass, args, block)
        @klass = klass
        @args  = args
        @block = block
      end

      delegate :name, to: :klass

      def ==(other)
        case other
        when Sieve
          klass == other.klass
        when Class
          klass == other
        end
      end

      def inspect
        if klass.is_a?(Class)
          klass.to_s
        else
          klass.class.to_s
        end
      end

      def build(app)
        klass.new(app, *args, &block)
      end

      def build_instrumented(app)
        InstrumentationProxy.new(build(app), inspect)
      end
    end

    # This class is used to instrument the execution of a single sieve.
    # It proxies the `s` method transparently and instruments the method
    # call.
    class InstrumentationProxy
      EVENT_NAME = 'rhino.apply_sieve'

      def initialize(sieve, class_name)
        @sieve = sieve

        @payload = {
          sieve: class_name
        }
      end

      def resolve(scope, params)
        ActiveSupport::Notifications.instrument(EVENT_NAME, @payload) do
          @sieve.resolve(scope, params)
        end
      end
    end

    # Pretty much stolen from ActionDispatch::MiddlewareStack
    include Enumerable

    attr_accessor :sieves

    def initialize(*_args)
      @sieves = []
      yield(self) if block_given?
    end

    # rubocop:todo Style/ExplicitBlockArgument
    def each
      @sieves.each { |x| yield x }
    end
    # rubocop:enable Style/ExplicitBlockArgument

    delegate :[], :size, :last, to: :sieves

    def unshift(klass, *args, &block)
      sieves.unshift(build_sieve(klass, args, block))
    end

    def initialize_copy(other)
      self.sieves = other.sieves.dup
    end

    def insert(index, klass, *args, &block)
      index = assert_index(index, :before)
      sieves.insert(index, build_sieve(klass, args, block))
    end

    alias insert_before insert

    def insert_after(index, *args, &block)
      index = assert_index(index, :after)
      insert(index + 1, *args, &block)
    end

    def swap(target, *args, &block)
      index = assert_index(target, :before)
      insert(index, *args, &block)
      sieves.delete_at(index + 1)
    end

    def delete(target)
      sieves.delete_if { |m| m.klass == target }
    end

    def use(klass, *args, &block)
      sieves.push(build_sieve(klass, args, block))
    end

    def build(app = nil, &block)
      instrumenting = ActiveSupport::Notifications.notifier.listening?(InstrumentationProxy::EVENT_NAME)

      # Freeze only production so that reloading works
      sieves.freeze unless Rails.env.development?

      sieves.reverse.inject(app || block) do |a, e|
        if instrumenting
          e.build_instrumented(a)
        else
          e.build(a)
        end
      end
    end

    private

    def assert_index(index, where)
      i = index.is_a?(Integer) ? index : sieves.index { |m| m.klass == index }
      raise "No such sieve to insert #{where}: #{index.inspect}" unless i

      i
    end

    def build_sieve(klass, args, block)
      Sieve.new(klass, args, block)
    end
  end
end

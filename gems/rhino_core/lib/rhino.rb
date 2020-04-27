# frozen_string_literal: true

require 'rhino/engine'
require 'active_support'

module Rhino
  extend ActiveSupport::Autoload
  extend ActiveSupport::Concern

  autoload :SieveStack, 'rhino/sieve'

  # The root path for the api ie '/api'
  mattr_accessor :namespace, default: :api

  # List of resources
  mattr_accessor :resources, default: []

  # sieves
  mattr_accessor :sieves

  ##
  # Stolen from devise
  #
  # https://github.com/jinzhu/devise/blob/b94ee9da98b16e4c8fbdc91af8605669d01b17e6/lib/devise.rb#L239
  class Getter
    def initialize(name)
      @name = name
    end

    def get
      ActiveSupport::Dependencies.constantize(@name)
    end
  end

  def self.ref(arg)
    ActiveSupport::Dependencies.reference(arg)
    Getter.new(arg)
  end
  #
  ##

  # Get the resource classes from the resource reference object.
  def self.resources
    @@resource_refs.map(&:get)
  end

  # Set the resource classes reference array to access the resource classes.
  def self.resources=(class_names)
    @@resource_refs = class_names.map { |class_name| ref(class_name) } # rubocop:disable Style/ClassVars
  end
  self.resources = []

  self.sieves = Rhino::SieveStack.new do |sieve|
    sieve.use Rhino::Sieve::Filter

    sieve.use Rhino::Sieve::Search

    sieve.use Rhino::Sieve::Order

    sieve.use Rhino::Sieve::Offset

    sieve.use Rhino::Sieve::Limit, default_limit: 20
  end

  def self.auth_owner
    @@auth_owner_ref.get
  end

  # Set the auth owner reference object to access the mailer.
  def self.auth_owner=(class_name)
    @@auth_owner_ref = ref(class_name) # rubocop:disable Style/ClassVars
  end
  self.auth_owner = 'User'

  def self.base_owner
    @@base_owner_ref.get
  end

  # Set the mailer reference object to access the mailer.
  def self.base_owner=(class_name)
    @@base_owner_ref = ref(class_name) # rubocop:disable Style/ClassVars
  end
  self.base_owner = 'User'

  def self.same_owner?
    base_owner == auth_owner
  end

  def self.base_to_auth
    return auth_owner.model_name.i18n_key if same_owner?

    base_owner.reflections.find { |_name, reflection| reflection.klass == auth_owner }&.first&.to_sym
  end

  # Default way to set up Rhino
  def self.setup
    yield self

    raise NotImplementedError, "#{Rhino.base_owner} must have reflection for #{Rhino.auth_owner}" if base_to_auth.nil?
  end
end

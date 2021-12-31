# frozen_string_literal: true

require 'rhino/engine'
require 'validators/country_validator'
require 'validators/email_validator'
require 'active_support'

module Rhino
  extend ActiveSupport::Autoload
  extend ActiveSupport::Concern

  autoload :SieveStack, 'rhino/sieve'

  # The root path for the api ie '/api'
  mattr_accessor :namespace, default: :api

  # Include Rhino::Resource::ActiveRecordExtension by default
  mattr_accessor :auto_include_active_record, default: true

  mattr_accessor :resources, default: if Rails.env.production?
                                        ['ActiveStorage::Attachment']
                                      else
                                        ['ActiveStorage::Attachment', 'Rhino::OpenApiInfo', 'Rhino::InfoGraph']
                                      end

  mattr_accessor :resource_classes

  mattr_accessor :registered_modules, default: {}

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
  def self.resource_classes
    resource_classes ||= resources.map(&:constantize)

    resource_classes
  end

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

  def self.auth_owner_sym
    auth_owner.to_s.underscore.pluralize.to_sym
  end

  def self.base_owner
    @@base_owner_ref.get
  end

  # Set the mailer reference object to access the mailer.
  def self.base_owner=(class_name)
    @@base_owner_ref = ref(class_name) # rubocop:disable Style/ClassVars
  end
  self.base_owner = 'User'

  def self.base_owner_sym
    base_owner.to_s.underscore.pluralize.to_sym
  end

  def self.same_owner?
    base_owner == auth_owner
  end

  def self.base_to_auth
    return auth_owner.model_name.i18n_key if same_owner?

    return auth_owner_sym if base_owner.reflections.key?(auth_owner_sym.to_s)

    nil
  end

  def self.auth_to_base
    return auth_owner.model_name.i18n_key if same_owner?

    return base_owner_sym if auth_owner.reflections.key?(base_owner_sym.to_s)

    nil
  end

  # Default way to set up Rhino
  def self.setup
    yield self
  end
end

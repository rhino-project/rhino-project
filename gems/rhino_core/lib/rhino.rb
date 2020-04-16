# frozen_string_literal: true

require 'rhino/engine'
require 'active_support'

module Rhino
  extend ActiveSupport::Concern

  # The root path for the api ie '/api'
  mattr_accessor :namespace, default: :api

  # Base owner
  mattr_accessor :base_owner, default: :user

  # List of resources
  mattr_accessor :resources, default: []

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

  # List of models that need to be wrapped in MetaModel
  mattr_accessor :proxy_models, default: {}

  # FIXME: Cache this - Devise has some nice code in devise.rb to do this
  def self.base_owner_class
    base_owner.to_s.humanize.classify.constantize
  end

  def self.resource_from_path(path)
    path.remove(%r{^\/#{namespace}\/}).split('/').first
  end

  def self.resource_by_association(association)
    proxy_models[association.options[:class_name]]&.safe_constantize || association.klass
  end

  def self.resource_instance(inst)
    return proxy_models[inst.class.name].constantize.new inst if proxy_models.key?(inst.class.name)

    inst
  end

  # Default way to set up Rhino
  def self.setup
    yield self
  end
end

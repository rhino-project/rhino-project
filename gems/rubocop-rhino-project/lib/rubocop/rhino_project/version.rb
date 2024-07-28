# frozen_string_literal: true

module RubocopRhinoProject
  # Returns the currently loaded version of Rhino core as a +Gem::Version+.
  def self.gem_version
    Gem::Version.new VERSION::STRING
  end

  module VERSION
    MAJOR = 0
    MINOR = 20
    TINY  = 0
    PRE   = "beta.108"

    STRING = [MAJOR, MINOR, TINY, PRE].compact.join(".")
  end
end

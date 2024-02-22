# frozen_string_literal: true

module Rhino
  module PaperTrailWhodunnit
    extend ActiveSupport::Concern

    included do
      before_action :set_paper_trail_whodunnit if defined? PaperTrail
    end
  end
end

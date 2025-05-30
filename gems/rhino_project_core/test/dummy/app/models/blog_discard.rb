# frozen_string_literal: true

class BlogDiscard < ApplicationRecord
  include Discard::Model

  belongs_to :user

  rhino_owner_base
  rhino_references %i[ user ]
  rhino_properties_read except: %i[discarded_at]
  rhino_properties_create except: %i[discarded_at]
  rhino_controller :active_record_discard
end

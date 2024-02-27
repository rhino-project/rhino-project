# frozen_string_literal: true

require "rhino/resource/active_model_extension/backing_store/google_sheet"

class GoogleSheet
  include Rhino::Resource::ActiveModelExtension
  include Rhino::Resource::ActiveModelExtension::BackingStore::GoogleSheet

  self.sheet_id = "1gZNS_SxDXXQ3R8FOalQZUoEmNhVbfvRWrgiOMbjXmcw"

  attribute :id, :integer
  attribute :title, :string
  attribute :category, :string

  rhino_owner_base
  rhino_policy :admin
  # rhino_properties_write except: [:id]
end

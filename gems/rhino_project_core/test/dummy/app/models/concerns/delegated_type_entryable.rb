# frozen_string_literal: true

module DelegatedTypeEntryable
  extend ActiveSupport::Concern

  included do
    has_one :delegated_type_entry, as: :entryable, touch: true
  end
end

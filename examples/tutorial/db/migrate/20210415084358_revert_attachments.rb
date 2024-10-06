require_relative '20190927173804_create_attachments.rb'

class RevertAttachments < ActiveRecord::Migration[6.0]
  def change
    revert CreateAttachments
  end
end

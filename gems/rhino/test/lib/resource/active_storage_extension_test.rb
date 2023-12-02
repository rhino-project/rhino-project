# frozen_string_literal: true

require "test_helper"

class ActiveStorageExtensionTest < ActiveSupport::TestCase
  def setup
    create(:blog)
  end

  test "url_attachment includes disposition" do
    assert Blog.first.banner.url_attachment.ends_with?("disposition=attachment")
  end
end

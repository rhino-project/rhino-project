# frozen_string_literal: true

require "test_helper"

class CrudControllerDelegatedTypeTest < Rhino::TestCase::ControllerTest
  def setup
    super

    sign_in
  end

  test "creates and returns resource" do
    entry_attr = { user: @current_user.id, string_field: "test", entryable_type: "DelegatedTypeMessage", entryable: { subject: "blah" } }

    assert_difference ["DelegatedTypeEntry.count", "DelegatedTypeMessage.count"], 1 do
      post_api delegated_type_entries_path, params: entry_attr
    end

    assert_response_ok
    assert_equal entry_attr[:string_field], parsed_response["string_field"]
    assert_equal entry_attr[:entryable][:subject], parsed_response["entryable"]["subject"]
  end
end

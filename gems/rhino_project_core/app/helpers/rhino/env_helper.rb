# frozen_string_literal: true

module Rhino
  module EnvHelper
    module_function

    def rhino_env_tag
      # Filter environment variables to get only those starting with "RHINO_PUBLIC"
      rhino_public_env = ENV.select { |key, _| key.start_with?("RHINO_PUBLIC") }

      # Create a JavaScript object with the environment variables
      js_env = rhino_public_env.transform_keys { |key| key.sub("RHINO_PUBLIC_", "") }

      # Create a JavaScript snippet that initializes window.rhino.env
      js_code = <<~JS
        (function() {
          window.rhino = window.rhino || {};
          window.rhino.env = window.rhino.env || {};
          var env = #{js_env.to_json};
          for (var key in env) {
            if (Object.prototype.hasOwnProperty.call(env, key)) {
              window.rhino.env[key] = env[key];
            }
          }
        })();
      JS

      # Return as a script tag
      javascript_tag(js_code)
    end
  end
end

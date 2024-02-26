
Rails.application.config.generators do |g|

  # No assets by default, we have an SPA front end
  g.assets false

  # No helpers by default, controllers share a common base
  g.resource_controller :controller, helper: false

  # No resource route by default, routes are generated
  g.resource_route false

  # Don't let inherited_resources via ActiveAdmin pollute our namespace
  # https://stackoverflow.com/questions/59991089/using-custom-scaffold-templates-for-rails-models-and-controllers-inherited-re/61088467#61088467
  g.scaffold_controller :scaffold_controller, helper: false

  # No specs by default
  g.test_framework :mini_test
end

# frozen_string_literal: true

# .underscore will automatically replace '::' with '/'
skip_descendants = false unless defined?(skip_descendants)
skip_ancestors = false unless defined?(skip_ancestors)
partial_path = 'api/' + model.class.name.underscore
klass = partial_path.split('/').last
partial_path = partial_path.pluralize
if lookup_context.template_exists? klass, partial_path, true
  json.partial! partial_path + '/' + klass, klass.to_sym => model, skip_descendants: skip_descendants, skip_ancestors: skip_ancestors
else
  json.partial! 'rhino/crud/model', model: model, skip_descendants: skip_descendants, skip_ancestors: skip_ancestors
end

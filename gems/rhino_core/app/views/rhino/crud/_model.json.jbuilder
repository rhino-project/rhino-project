# frozen_string_literal: true

# If the included_model was optional, bail out
return unless model

json.can_current_user_edit Pundit.policy(current_user, model).update?

json.display_name model.display_name
model.viewable_attributes.each do |attribute|
  description = model.describe_attribute(attribute)

  case description[:type]
  when :reference
    unless defined?(skip_ancestors) && skip_ancestors
      json.set!(description[:name]) do
        json.partial! 'rhino/model', model: model.fetch_reference(description[:name]), skip_descendants: true
      end
    end
  when :array
    unless defined?(skip_descendants) && skip_descendants
      json.set!(description[:name]) do
        json.array! model.fetch_reference(description[:name]), partial: 'rhino/model', as: :model, skip_descendants: true, skip_ancestors: true
      end
    end
  else
    json.call model, attribute
  end
end

# frozen_string_literal: true

json.total @total
json.results do
  json.array! @models, partial: 'rhino/crud/model', as: :model
end

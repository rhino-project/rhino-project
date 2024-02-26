# frozen_string_literal: true

# correction for nested forms errors indexation
# this correction is still necessary in rails 7.0
module ActiveRecord::AutosaveAssociation
  private
    def validate_collection_association(reflection)
      return unless (association = association_instance_get(reflection.name))

      return unless (records = associated_records_to_validate_or_save(association, new_record?, reflection.options[:autosave]))

      all_records = association.target.find_all
      records.each do |record|
        index = all_records.find_index(record)
        association_valid?(reflection, record, index)
      end
    end
end

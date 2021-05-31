# frozen_string_literal: true

module Rhino
  module Resource
    module ActiveModelExtension
      module BackingStore
        module GoogleSheet
          extend ActiveSupport::Concern

          def backing_store_update
            attr_map = sheet.list.keys.index_by(&:downcase)

            # ID won't be mapped
            attrs = serializable_hash(except: :id).transform_keys { |k| attr_map[k] }

            sheet.list[id - 1].update(attrs)

            sheet.synchronize
          end

          def backing_store_destroy
            sheet.delete_rows(id + 1, 1)

            sheet.synchronize
          end

          included do
            thread_mattr_accessor :google_client
            thread_mattr_accessor :google_sheet
            thread_mattr_accessor :google_worksheet

            class_attribute :sheet_id, default: nil
            class_attribute :work_sheet_title, default: nil

            delegate :sheet, to: :class
          end

          class_methods do # rubocop:todo Metrics/BlockLength
            def backing_store_index
              sheet.reload

              idx = 0
              sheet.list.map do |row|
                idx += 1
                row_to_instance(row, idx)
              end
            end

            def backing_store_create(model)
              attr_map = sheet.list.keys.index_by(&:downcase)

              # ID won't be mapped
              attrs = model.serializable_hash(except: :id).transform_keys { |k| attr_map[k] }

              sheet.list.push(attrs)

              sheet.synchronize
            end

            def backing_store_show(id)
              sheet.reload

              row_to_instance(sheet.list[id.to_i - 1], id)
            end

            def sheet
              return @google_worksheet if @google_worksheet

              @google_client = GoogleDrive::Session.from_service_account_key(nil)

              # Pass the sheet id
              @google_sheet = @google_client.spreadsheet_by_key(sheet_id)

              return @google_worksheet = @google_sheet.worksheet_by_title(work_sheet_title) if work_sheet_title

              @google_worksheet = @google_sheet.worksheets[0]
            end

            def row_to_instance(row, id)
              attrs = row.to_hash
              attrs = attrs.transform_keys(&:downcase).transform_keys(&:to_sym)
              new(attrs.merge(id: id))
            end
          end
        end
      end
    end
  end
end

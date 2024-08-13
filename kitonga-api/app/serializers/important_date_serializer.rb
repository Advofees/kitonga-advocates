class ImportantDateSerializer < ActiveModel::Serializer
  attributes :id, :activity_description, :date_time, :case_id
end

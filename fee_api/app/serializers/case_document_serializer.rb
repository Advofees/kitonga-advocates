class CaseDocumentSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :case_id
end

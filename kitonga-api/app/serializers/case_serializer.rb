class CaseSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :case_no_or_parties, :record, :file_reference, :clients_reference, :client_id, :status, :payment_initialized, :created_at, :updated_at
end

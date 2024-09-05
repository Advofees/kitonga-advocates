class ClientSerializer < ActiveModel::Serializer
  attributes :id, :name, :username, :email, :contact_number, :address, :group, :created_at, :updated_at
end

class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :name, :email, :contact_number, :address
end

class LocationSerializer < ActiveModel::Serializer
  attributes :id, :name, :address, :contact_number
end

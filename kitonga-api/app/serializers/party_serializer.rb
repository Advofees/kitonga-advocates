class PartySerializer < ActiveModel::Serializer
  attributes :id, :case_id, :party_type, :name, :email, :contact_number, :address
end

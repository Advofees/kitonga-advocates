class PaymentSerializer < ActiveModel::Serializer
  attributes :id, :amount, :payment_type, :payment_method, :payment_information_id
end

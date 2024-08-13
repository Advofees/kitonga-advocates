class PaymentInformationSerializer < ActiveModel::Serializer
  attributes :id, :case_id, :payment_type, :outstanding, :paid_amount, :total_fee, :cummulative_payments, :deposit_pay, :deposit_fees, :final_fees, :final_pay, :deposit
end

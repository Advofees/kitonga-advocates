class Payment < ApplicationRecord

    validates :payment_method, inclusion: { in: [ "Cash", "Mpesa", "CreditCard", "DebitCard" ] }
    validates :payment_type, inclusion: { in: ["final", "deposit", "installment", "full"] } 

    # belongs_to :client
    belongs_to :payment_information

    has_one_attached :receipt
end

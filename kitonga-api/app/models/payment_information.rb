class PaymentInformation < ApplicationRecord

    validates :payment_type, inclusion: { in: ["full", "installment"] } 

    belongs_to :case

    has_many :payments, dependent: :destroy

    def cummulative_payments
        payments
    end
end

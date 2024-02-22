class Payment < ApplicationRecord

    validates :payment_method, inclusion: { in: [ "Mpesa", "Credit Card", "Debit Card", "PayPal", "Stripe", "Apple", "Paypal", "Google Pay", "Bank Transfer", "Cash on Delivery (COD)", "Cryptocurrencies", "Digital Wallets", "Checks", "Gift Cards", "Mobile Billing", "Installment Plans", "Bank Transfers (ACH)", "Wire Transfers", "E-checks",   "Amazon Pay", "Alipay", "WeChat Pay" ] }
    validates :payment_type, inclusion: { in: ["final", "deposit", "installment"] } 

    # belongs_to :client
    belongs_to :payment_information

    has_one_attached :receipt
end

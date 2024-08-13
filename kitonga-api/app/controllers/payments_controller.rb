class PaymentsController < ApplicationController    
    def serve_receipt
        payment = find_payment
        if payment.receipt.attached?
            redirect_to rails_blob_url(payment.receipt)
        else
            render json: { message: "File Not Found" }, status: :not_found
        end
    end

    def show
        render json: find_payment
    end

    def update
        payment = find_payment
        payment.update!(payment_params)
        update_payment_information(payment.payment_information, payment)
        render json: payment.payment_information, status: :accepted
    end

    def destroy
        payment = find_payment
        payment_information = payment.payment_information
        payment.destroy
        update_payment_information(payment.payment_information, payment)
        render json: payment.payment_information, status: :no_content
    end

    def update_payment_information(payment_information, payment)
        if payment.payment_information_id === payment_information.id
            # Retrieve associated payments
            associated_payments = payment_information.payments

            # Update paid amount and balance due
            payment_information.paid_amount = associated_payments.map(&:amount).sum
            payment_information.outstanding = payment_information.total_fee - payment_information.paid_amount

            # Resave payment information
            payment_information.save
        end
    end

    private

    def find_payment
        Payment.find(params[:id])
    end

    def payment_params
        params.permit(:id, :amount, :payment_type, :payment_method, :payment_information_id)
    end
end

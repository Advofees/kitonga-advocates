class CreatePaymentInformations < ActiveRecord::Migration[7.0]
  def change
    create_table :payment_informations, id: :uuid do |t|
      t.uuid :case_id
      t.string :payment_type
      t.decimal :outstanding
      t.decimal :paid_amount
      t.decimal :total_fee

      # Legacy fields
      t.decimal :deposit_pay
      t.decimal :deposit_fees
      t.decimal :final_fees
      t.decimal :final_pay
      t.decimal :deposit

      t.timestamps
    end
  end
end

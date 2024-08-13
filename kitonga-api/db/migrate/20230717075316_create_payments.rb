class CreatePayments < ActiveRecord::Migration[7.0]
  def change
    create_table :payments, id: :uuid do |t|
      t.decimal :amount
      t.string :payment_method
      t.string :payment_type
      t.uuid :payment_information_id

      t.timestamps
    end
  end
end

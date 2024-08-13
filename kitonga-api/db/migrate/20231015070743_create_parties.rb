class CreateParties < ActiveRecord::Migration[7.0]
  def change
    create_table :parties, id: :uuid do |t|
      t.uuid :case_id
      t.string :party_type
      t.string :name
      t.string :email
      t.string :contact_number
      t.string :address

      t.timestamps
    end
  end
end

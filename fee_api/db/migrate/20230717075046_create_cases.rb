class CreateCases < ActiveRecord::Migration[7.0]
  def change
    create_table :cases, id: :uuid do |t|
      t.string :title
      t.string :description
      t.string :case_no_or_parties
      t.integer :record
      t.string :file_reference
      t.string :clients_reference
      t.string :status, default: "Pre Filing"
      t.uuid :client_id

      t.timestamps
    end
  end
end

# File Reference
# 
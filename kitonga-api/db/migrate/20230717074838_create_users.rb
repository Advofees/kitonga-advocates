class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :username
      t.string :name
      t.string :email
      t.string :contact_number
      t.string :address
      t.string :password_digest

      # More fields
      t.boolean :is_admin

      t.timestamps
    end
  end
end

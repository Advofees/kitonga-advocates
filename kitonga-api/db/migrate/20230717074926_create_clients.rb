class CreateClients < ActiveRecord::Migration[7.0]
  def change
    create_table :clients, id: :uuid do |t|
      t.string :group
      t.string :name
      t.string :username
      t.string :email
      t.string :address
      t.string :contact_number
      t.string :password_digest, :default => 'password', :null => true

      t.timestamps
    end
  end
end

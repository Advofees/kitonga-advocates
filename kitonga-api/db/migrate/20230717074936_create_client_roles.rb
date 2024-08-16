class CreateClientRoles < ActiveRecord::Migration[7.0]
  def change
    create_table :client_roles, id: :uuid do |t|

      t.uuid :client_id
      t.uuid :role_id

      t.timestamps
    end
  end

  # unique index on the combination of client_id and role_id
    add_index :client_roles, [:client_id, :role_id], unique: true
end

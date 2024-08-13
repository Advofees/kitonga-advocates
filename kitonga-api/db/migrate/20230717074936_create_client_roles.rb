class CreateClientRoles < ActiveRecord::Migration[7.0]
  def change
    create_table :client_roles, id: :uuid do |t|

      t.uuid :client_id
      t.uuid :role_id

      t.timestamps
    end
  end
end

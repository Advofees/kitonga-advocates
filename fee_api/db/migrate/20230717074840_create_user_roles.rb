class CreateUserRoles < ActiveRecord::Migration[7.0]
  def change
    create_table :user_roles, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :role_id

      t.timestamps
    end
  end
end

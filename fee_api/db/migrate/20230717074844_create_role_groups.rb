class CreateRoleGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :role_groups, id: :uuid do |t|
      t.uuid :role_id
      t.uuid :group_id

      t.timestamps
    end
  end
end

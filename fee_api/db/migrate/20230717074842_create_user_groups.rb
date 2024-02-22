class CreateUserGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :user_groups, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :group_id

      t.timestamps
    end
  end
end

class CreateClientGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :client_groups, id: :uuid do |t|

      t.uuid :client_id
      t.uuid :group_id

      t.timestamps
    end
  end
end

class CreateClients < ActiveRecord::Migration[7.0]
  def change
    create_table :clients, id: :uuid do |t|
      t.uuid :user_id

      t.timestamps
    end
  end
end

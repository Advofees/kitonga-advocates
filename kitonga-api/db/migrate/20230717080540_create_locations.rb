class CreateLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :locations, id: :uuid do |t|
      t.string :name
      t.string :address
      t.string :contact_number

      t.timestamps
    end
  end
end

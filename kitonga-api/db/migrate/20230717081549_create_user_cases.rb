class CreateUserCases < ActiveRecord::Migration[7.0]
  def change
    create_table :user_cases, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :case_id

      t.timestamps
    end
  end
end

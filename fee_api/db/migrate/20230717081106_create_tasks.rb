class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks, id: :uuid do |t|
      t.string :description
      t.date :due_date
      t.string :completion_status
      t.uuid :case_id
      t.uuid :user_id

      t.timestamps
    end
  end
end

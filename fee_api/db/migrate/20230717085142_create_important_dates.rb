class CreateImportantDates < ActiveRecord::Migration[7.0]
  def change
    create_table :important_dates, id: :uuid do |t|
      t.string :activity_description
      t.string :date_time
      t.uuid :case_id

      t.timestamps
    end
  end
end

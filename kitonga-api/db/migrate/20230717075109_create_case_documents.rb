class CreateCaseDocuments < ActiveRecord::Migration[7.0]
  def change
    create_table :case_documents, id: :uuid do |t|
      t.string :title
      t.string :description
      t.uuid :case_id

      t.timestamps
    end
  end
end

class CreateAccessPolicies < ActiveRecord::Migration[7.2]
  def change
    create_table :access_policies, id: :uuid do |t|
      t.string :name
      t.string :description
      t.string :effect

      t.jsonb :actions, default: []
      t.jsonb :principals, default: []
      t.jsonb :resources, default: []
      t.jsonb :conditions, default: []

      t.timestamps
    end
  end
end

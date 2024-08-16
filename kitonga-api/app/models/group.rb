class Group < ApplicationRecord
    has_many :user_groups
    has_many :users, through: :user_groups

    has_many :role_groups
    has_many :roles, through: :role_groups

    before_save :uppercase_name

    def self.policy_column_names
        [ :id, :name ]
    end

    private

    def uppercase_name
        self.name = ["GROUP", *name.upcase.split(/\s+/)].join("_")
    end
end

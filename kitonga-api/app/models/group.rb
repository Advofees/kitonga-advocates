class Group < ApplicationRecord

    validates :name, presence: true, uniqueness: true
    validate :name_taken?
    validate :check_spaces

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
        self.name = prefixed_name
    end

    def prefixed_name
        ["GROUP", *name.upcase.split(/\s+/)].join("_")
    end

    def check_spaces
        errors.add(:name, "can't contain spaces") if name&.match?(/\s+/)
    end

    def name_taken?
        errors.add(:name, "name #{prefixed_name} already taken") if Group.exists?(name: prefixed_name)
    end
end

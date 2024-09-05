class ResourceAction < ApplicationRecord
    validates :name, uniqueness: true, presence: true

    validate :check_spaces

    def self.policy_column_names
        [:id, :name]
    end

    private

    def check_spaces
        errors.add(:name, "can't contain spaces") if name&.match?(/\s+/)
    end
end

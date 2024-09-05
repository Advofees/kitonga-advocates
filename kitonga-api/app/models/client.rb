class Client < ApplicationRecord
    
    has_secure_password

    validates :name, presence: true
    validates :username, uniqueness: { case_sensitive: false }, presence: true
    validates :email, uniqueness: { case_sensitive: false }, presence: true
    validates :password, length: { minimum: 8 }

    has_many :client_roles
    has_many :roles, through: :client_roles

    has_many :client_groups
    has_many :groups, through: :client_groups

    has_many :cases, dependent: :destroy

    def self.policy_column_names
        [ :id, :username, :email ]
    end
end

class Client < ApplicationRecord
    
    has_secure_password

    has_many :client_roles
    has_many :roles, through: :client_roles

    has_many :client_groups
    has_many :groups, through: :client_groups

    has_many :cases, dependent: :destroy
end

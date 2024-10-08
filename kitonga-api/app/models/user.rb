class User < ApplicationRecord

    has_secure_password

    validates :name, presence: true
    validates :username, uniqueness: { case_sensitive: false }, presence: true
    validates :email, uniqueness: { case_sensitive: false }, presence: true
    validates :password, length: { minimum: 8 }

    has_many :user_roles
    has_many :roles, through: :user_roles

    has_many :user_groups
    has_many :groups, through: :user_groups

    has_many :user_cases
    has_many :cases, through: :user_cases

    # has_many :clients, through: :cases

    has_many :payments
    has_many :notes
    has_many :tasks

    has_many :hearing_users
    has_many :hearings, through: :hearing_users

    def self.policy_column_names
        [ :id, :username, :email ]
    end

    def authorities
        [ *roles.map(&:name), *groups.map(&:name), *groups.map { |grp| grp.roles.map(&:name) } ].flatten.uniq
    end

    def auth_identifiers
        [
            resource_identifiers,
            roles.map(&:resource_identifiers),
            groups.map(&:resource_identifiers),
            groups.map { |grp| grp.roles.map(&:resource_identifiers) }
    ].flatten.uniq
    end
end

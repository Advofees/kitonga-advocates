class RoleGroup < ApplicationRecord
    belongs_to :role
    belongs_to :group
end

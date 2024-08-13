class ClientRole < ApplicationRecord
    belongs_to :client
    belongs_to :role
end
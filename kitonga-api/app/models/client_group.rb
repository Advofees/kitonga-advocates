class ClientGroup < ApplicationRecord
    belongs_to :client
    belongs_to :group
end

class Party < ApplicationRecord

    validates :party_type, inclusion: { in: ["plaintiff", "defendant"] }

    belongs_to :case
end

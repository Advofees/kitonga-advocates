class LoginDto < ApplicationRecord
  validates :identity, presence: true
  validates :password, presence: true
  validates :grant_type, inclusion: { in: ['user', 'client'] }
end
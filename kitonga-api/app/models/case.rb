class Case < ApplicationRecord

    # # Validations
    # validates :title, presence: true
    # validates :description, presence: true
    validates :case_no_or_parties, presence: true
    validates :record, presence: true
    validates :file_reference, presence: true
    validates :clients_reference, presence: true
    validates :status, inclusion: { in: [
        "Pre Filing",
        "Filing",
        "Pleadings",
        "Discovery",
        "Pre Trial Motions",
        "Trial",
        "Verdict",
        "Appeal",
        "Enforcement",
        "Post Judgment Motions",
        "Settlement",
        "Closed"
    ]}

    belongs_to :client

    has_many :parties, dependent: :destroy

    # Users assigned to a case
    has_many :user_cases, dependent: :destroy
    has_many :users, through: :user_cases

    # Documents associated with a case
    has_many :case_documents, dependent: :destroy
    
    # Payment information to a case
    has_one :payment_information, dependent: :destroy

    # Payment Information State
    def payment_initialized
        !!payment_information
    end

    # Tasks to be undertaken by the users assigned to a case
    has_many :tasks, dependent: :destroy

    # Important dates to carry on with the case
    has_many :important_dates, dependent: :destroy
end

class CasePolicy < ApplicationPolicy

  def add_party?
    resolve_access?("AddParty")
  end

  def add_installment?
    resolve_access?("AddInstallment")
  end

  def initialize_payment_information?
    resolve_access?("InitializePaymentInformation")
  end

  def view_payment_information?
    resolve_access?("ViewPaymentInformation")
  end

  def update_payment_information?
    resolve_access?("UpdatePaymentInformation")
  end

  def view_documents?
    resolve_access?("ViewDocuments")
  end

  def view_hearings?
    resolve_access?("ViewHearings")
  end

  def view_important_dates?
    resolve_access?("ViewImportantDates")
  end

  def view_tasks?
    resolve_access?("ViewTasks")
  end

  def view_parties?
    resolve_access?("ViewParties")
  end

  def view?
    show?
  end

  def create?
    resolve_access?("CreateCase")
  end

  def delete?
    destroy?
  end

  def show?
    resolve_access?("ViewCase")
  end 

  def destroy?
    resolve_access?("DestroyCase")
  end

  def update?
    resolve_access?("UpdateCase")
  end

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    def resolve
      if is_admin?
        scope.all
      elsif Client.exists?(user_id: @user.principal["id"])
        client = Client.find_by(user_id: @user.principal["id"])
        scope.where(client_id: client.id)
      else
        scope.none
      end
    end
  end
end

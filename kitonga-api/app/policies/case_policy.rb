class CasePolicy < ApplicationPolicy

  def view?
    show?
  end

  def create?
    is_admin?
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
      if @user&.grant == 'user'
        is_admin? ? scope.all : scope.joins(:user_cases).where(user_cases: { user_id: @user.principal["id"] })
      elsif(@user&.grant == 'client')
        scope.where(client_id: @user.principal["id"])
      else
        scope.none
      end
    end
  end
end

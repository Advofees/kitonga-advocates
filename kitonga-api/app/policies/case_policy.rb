class CasePolicy < ApplicationPolicy

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

  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
    def resolve
      if @user&.grant == 'user'
        has_role?("ROLE_ADMIN") ? scope.all : scope.joins(:user_cases).where(user_cases: { user_id: @user.principal["id"] })
      elsif(@user&.grant == 'client')
        scope.where(client_id: @user.principal["id"])
      end
    end

    private

    def has_role?(role)
      @user.present? && @user.authorities.include?(role)
    end
  end
end

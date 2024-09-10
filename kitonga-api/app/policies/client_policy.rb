class ClientPolicy < ApplicationPolicy

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
    is_admin? || @record.user_id == @user.principals["id"]
  end 

  def destroy?
    is_admin?
  end

  def destroy_multiple?
    destroy?
  end

  def update?
    is_admin?
  end

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    def resolve
      is_admin? ? scope.all : scope.none
    end
  end
end

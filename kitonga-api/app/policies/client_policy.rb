class ClientPolicy < ApplicationPolicy

  def view?
    show?
  end

  def create?
    is_admin? || resolve_access?("CreateClient")
  end

  def delete?
    destroy?
  end

  def show?
    is_admin? || resolve_access?("ViewClient")
  end 

  def destroy?
    is_admin? || resolve_access?("DestroyClient")
  end

  def update?
    is_admin? || resolve_access?("UpdateClient")
  end

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    def resolve
      is_admin? ? scope.all : scope.none
    end
  end
end

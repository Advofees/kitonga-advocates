class ClientPolicy < ApplicationPolicy

  def view?
    show?
  end

  def create?
    resolve_access?("CreateClient")
  end

  def delete?
    destroy?
  end

  def show?
    resolve_access?("ViewClient")
  end 

  def destroy?
    resolve_access?("DestroyClient")
  end

  def update?
    resolve_access?("UpdateClient")
  end

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    def resolve
      is_admin? ? scope.all : scope.none
    end
  end
end

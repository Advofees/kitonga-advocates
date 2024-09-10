class GroupPolicy < ApplicationPolicy
  # NOTE: Up to Pundit v2.3.1, the inheritance was declared as
  # `Scope < Scope` rather than `Scope < ApplicationPolicy::Scope`.
  # In most cases the behavior will be identical, but if updating existing
  # code, beware of possible changes to the ancestors:
  # https://gist.github.com/Burgestrand/4b4bc22f31c8a95c425fc0e30d7ef1f5

  def remove_users?
      is_admin?
  end
  
  def add_users?
      is_admin?
  end
  
  def remove_roles?
      is_admin?
  end
  
  def add_roles?
      is_admin?
  end
  
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
      is_admin?
  end 
  
  def destroy?
      is_admin?
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

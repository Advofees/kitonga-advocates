class ClientPolicy < ApplicationPolicy

  def show?
    unless !has_role?("ROLE_ADMIN")
      return true
    end
    return false
  end

  class Scope < Scope
    # NOTE: Be explicit about which records you allow access to!
    def resolve
      has_role?("ROLE_ADMIN") ? scope.all : []
    end

    private

    def has_role?(role)
      @user.present? && @user.authorities.include?(role)
    end
  end
end

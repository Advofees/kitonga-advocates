class CasePolicy < ApplicationPolicy

  def show?
    unless !has_role?("ROLE_ADMIN")
      return true
    end
    
    if @user&.grant == 'client'
      return @record.client_id == @user.principal["id"]
    else
      return @record.user_cases.map(&:user_id).include?(@user.principal["id"])
    end
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

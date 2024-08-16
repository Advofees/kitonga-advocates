# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    raise Pundit::NotAuthorizedError, "You are not logged in" unless user
    @user = user
    @record = record
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  def has_role?(role)
    @user.authorities.include?(role)
  end

  def repeat_string(str, n = 1)
    (0...n).to_a.map { str }
  end

  def wrap_with_modulus(elements)
    elements.map { |str| "%#{str}%" }
  end

  # AND EXISTS (
  # SELECT 1
  # FROM jsonb_array_elements(principals) AS elem
  # WHERE #{repeat_string("elem::text ILIKE ?", principal_where_tokens.length).join(" OR ")}
  # )

  def resolve_access?(desired_action)
        action = ResourceAction.find_by name: desired_action

        unless action
          raise ResourceNotFoundException.new("The action your are trying to perform is not registered.")
        end

        resource_where_tokens = @record.resource_identifiers

        action_where_tokens = ["krn:resourceaction:id:#{action.id}"]

        policies = AccessPolicy
                    .select("DISTINCT access_policies.*")
                    .where("EXISTS (
                                SELECT 1
                                FROM jsonb_array_elements(resources) AS elem
                                WHERE #{repeat_string("elem::text ILIKE ?", resource_where_tokens.length).join(" OR ")}
                            )
                            AND EXISTS (
                                SELECT 1
                                FROM jsonb_array_elements(actions) AS elem
                                WHERE #{repeat_string("elem::text ILIKE ?", action_where_tokens.length).join(" OR ")}
                            )", 
                            *wrap_with_modulus(resource_where_tokens),
                            *wrap_with_modulus(action_where_tokens)
                        )
    
    # Immediately deny access if no policy is attached
    return false if (policies.nil? || policies.empty?)

    current_principals = @user.resource_identifiers
    
    # Evaluate each policy
    policies.each do |policy|
      return false if deny_access?(policy, current_principals)
      return true if allow_access?(policy, current_principals)
    end
    
    # No policy resolved at all
    false
  end

  def deny_access?(policy, current_principals)
    current_principals.intersect?(policy.principals) && policy.effect == "Deny"
  end

  def allow_access?(policy, current_principals)
    current_principals.intersect?(policy.principals) && policy.effect == "Allow"
  end

  class Scope
    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      raise NotImplementedError, "You must define #resolve in #{self.class}"
    end

    private

    attr_reader :user, :scope
  end
end

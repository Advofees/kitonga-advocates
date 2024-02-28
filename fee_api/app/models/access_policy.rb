class AccessPolicy < MongoidApplicationRecord
    
    field :name, type: String
    field :description, type: String

    # Whether to Allow or Deny access
    field :effect, type: String

    # Action performeable on the attached resources
    field :actions, type: Array

    # Principals(roles, groups, iams) to allow or deny access
    field :principals, type: Array

    # Resources managed by this policy
    field :resources, type: Array

    # Conditions for this policy
    field :conditions, type: Array

    validates :name, presence: true, uniqueness: true
    validates :description, presence: true
    validates :effect, inclusion: { in: %w(Allow Deny), message: "'%{value}' is not a valid effect" }

    validate :check_actions
    validate :check_principals
    validate :check_resources
    validate :check_conditions

    def check_conditions

    end

    def check_actions
        unless check_emptiness("actions", actions)
            return
        end

        action_pattern = /krn:action:.*:.*\z/

        actions.each do |action|
            unless validate_scheme("actions", action, action_pattern)
                break
            end

            unless entity_exists?("actions", action)
                break
            end
        end
    end

    def check_principals
        unless check_emptiness("principals", principals)
            return
        end

        principal_pattern = /\A(krn:(role|group|iam|client)):.*:.*\z/

        principals.each do |principal|
            
            unless validate_scheme("principals", principal, principal_pattern)
                break
            end

            unless entity_exists?("principals", principal)
                break
            end
        end
    end

    def check_resources
        unless check_emptiness("resources", resources)
            return
        end

        resource_pattern = /krn:.*:.*:.*\z/

        resources.each do |resource|
            unless validate_scheme("resources", resource, resource_pattern)
                break
            end

            unless entity_exists?("resources", resource)
                break
            end
        end
    end

    def validate_scheme(fld, scheme, pattern)

        # gsub(/\*/, "\\\\\\*")
        
        unless scheme.match(pattern)
            errors.add(fld.to_sym, "#{fld.capitalize} is an invalid KRN")
            return false
        end

        true
    end

    def check_emptiness(fld, fld_array)
        if fld_array.empty?
            errors.add(fld.to_sym, "At least one #{ActiveSupport::Inflector.singularize(fld)} is required")
            return false
        end
        true
    end

    def join_with_or(strings)
        if strings.length > 2
          last_element = strings.pop
          result = "#{strings.join(', ')} or #{last_element}"
        elsif strings.length == 2
          result = strings.join(' or ')
        else
          result = strings.join("")
        end
        result
      end

    def entity_exists?(flds, krn)

        _, resource_type, resource_field, resource_field_value = krn.split(':')

        exists = false

        if resource_type == "role"
            exists = Role.exists?(id: resource_id) || Role.exists?(name: resource_id)
            puts "exists: #{Role.exists?(name: resource_id)}"
        elsif resource_type = "case"
            exists = Case.exists?(id: resource_id)
        elsif resource_type == "client"
            exists = Client.exists?(id: resource_id)
        elsif resource_type == "group"
            exists = Group.exists?(id: resource_id)
        elsif resource_type == "action"
            exists = ResourceAction.exists?(id: resource_id) || ResourceAction.exists?(name: resource_id)
        elsif resource_type == "iam"
            exists = User.exists?(id: resource_id) || User.exists?(username: resource_id)
        elsif ["*", ""].include?(resource_type)
        else
            errors.add(flds.to_sym, "Invalid resource type")
        end

        unless exists
            errors.add(flds.to_sym, "#{krn} does not exist")
            return false
        end
        exists
    end
end

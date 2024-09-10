class AccessPolicy < ApplicationRecord
    
    validates :name, presence: true, uniqueness: true
    validate :check_spaces
    validate :only_letters_hyphens_and_underscores
    validates :description, presence: true
    validates :effect, inclusion: { in: %w(Allow Deny), message: "'%{value}' is not a valid effect" }

    validate :check_actions
    validate :check_principals
    validate :check_resources
    validate :check_conditions

    def check_spaces
        errors.add(:name, "can't contain spaces") if name&.match?(/\s+/)
    end

    def only_letters_hyphens_and_underscores
        errors.add(:name, "can only contain letters, hyphens, and underscores") if name&.match?(/[^a-zA-Z_-]+/)
    end

    def check_conditions
    end

    def check_actions
        unless check_emptiness("resourceactions", actions)
            return
        end

        action_pattern = /krn:resourceaction:.*:.*\z/

        actions.each do |action|
            unless validate_scheme("resourceactions", action, action_pattern)
                break
            end

            unless entity_exists?("resourceactions", action)
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
        
        unless scheme.match(pattern)
            errors.add(fld.to_sym, "#{scheme} is an invalid KRN")
            return false
        end

        true
    end

    def check_emptiness(fld, fld_array)
        if !fld_array || fld_array.empty?
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

    def self.resources
        {
            "role" => Role,
            "case" => Case,
            "client" => Client,
            "group" => Group,
            "resourceaction" => ResourceAction,
            "iam" => User
        }
    end

    def entity_exists?(flds, krn)

        _, resource_type, resource_field, resource_field_value = krn.split(':')

        entity = AccessPolicy.resources[resource_type]

        if(!!entity)
            unless entity.is_policy_attribute?(resource_field)
                errors.add(flds.to_sym, { "valid attributes" => entity.policy_column_names })
                return false
            end

            exists = false

            exists = entity.exists?({ "#{resource_field}" => resource_field_value})

            unless exists
                errors.add(flds.to_sym, "#{krn} does not exist")
                return false
            end
            exists
        else
            errors.add(flds.to_sym, "Invalid resource type")
            return false
        end
    end
end

class AuthContext

    attr_accessor :principal, :authorities, :resource_identifiers

    def initialize(principal, authorities, resource_identifiers)
        @principal = principal
        @authorities = authorities
        @resource_identifiers = resource_identifiers
    end
end
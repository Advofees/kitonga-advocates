class AuthContext

    attr_accessor :principal, :grant, :authorities, :resource_identifiers

    def initialize(principal, grant, authorities, resource_identifiers)
        @principal = principal
        @grant = grant
        @authorities = authorities
        @resource_identifiers = resource_identifiers
    end
end
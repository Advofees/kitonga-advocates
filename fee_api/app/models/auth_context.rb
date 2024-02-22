class AuthContext

    attr_accessor :principal, :grant, :authorities

    def initialize(principal, grant, authorities)
        @principal = principal
        @grant = grant
        @authorities = authorities
    end
end
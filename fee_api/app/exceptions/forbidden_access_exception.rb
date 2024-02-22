class ForbiddenAccessException < StandardError
    def initialize(message = 'You do not have access rights to this resource.')
      super
    end
end
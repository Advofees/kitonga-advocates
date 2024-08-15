class UnauthorizedAccessException < StandardError

    attr_accessor :status

    def initialize(message = 'You are not authorized to access this resource', status = 401)
      super(message)
      @status = status
    end
end
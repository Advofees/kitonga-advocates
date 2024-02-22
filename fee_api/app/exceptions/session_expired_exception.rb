class SessionExpiredException < StandardError
    def initialize(message = 'Session has expired.')
      super
    end
end
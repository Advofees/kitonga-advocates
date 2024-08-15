class ResourceNotFoundException < StandardError
    def initialize(message = 'Resource not found')
      super
    end
end
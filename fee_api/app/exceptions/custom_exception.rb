class CustomException < StandardError
    attr_accessor :code

    def initialize(message, code = 500)
        super(message)
        @code = code
    end
end
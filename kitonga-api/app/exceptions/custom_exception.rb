class CustomException < StandardError
    attr_accessor :code
    attr_accessor :status

    def initialize(message, status = "INTERNAL SERVER ERROR", code = 500)
        super(message)
        @status = status
        @code = code
    end
end
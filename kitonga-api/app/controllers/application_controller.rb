class ApplicationController < ActionController::API

    include Pundit::Authorization
    include ActionController::Cookies
    
    wrap_parameters format: []
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found_response
    rescue_from ResourceNotFoundException, with: :resource_not_found_response
    rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity_response
    rescue_from ForbiddenAccessException, with: :forbidden_access_response
    rescue_from SessionExpiredException, with: :session_expired_response
    rescue_from UnauthorizedAccessException, with: :unauthorized_access_response
    rescue_from CustomException, with: :custom_exception_response
    rescue_from Pundit::NotAuthorizedError, with: :policy_violation_response

    before_action :authenticate
    skip_before_action :authenticate, only: [:welcome]

    def welcome
        render json: { "Advokit" => "Advocacy and Case Management Suite" }
    end

    def authenticate
        unless logged_in?
            raise UnauthorizedAccessException
        end
    end

    def logged_in?
        !!pundit_user
    end

    def pundit_user
        @auth_context ||= find_user_by_token
    end

    def find_user_by_token
        token = cookies.signed[:user] || request.headers['Authorization']&.split(/\s+/)&.last
        if token
            decoded_token = decode_token(token)

            ensure_token_is_not_expired(decoded_token)

            payload = decoded_token.first

            user = User.find(payload['id'])

            unless !user
                @auth_context = AuthContext.new(
                    user.as_json(only: [:username, :id, :name, :email ]),
                    user.authorities,
                    user.auth_identifiers
                )
            end
        end
    end

    def ensure_token_is_not_expired(decoded_token)
        unless Time.at(decoded_token.last['exp']) > Time.now
            raise SessionExpiredException, "Your session has expired! Please login again."
        end
    end

    def decode_token(token)
        begin
            JWT.decode(token, secret_key, true, { algorithm: 'HS512' })
        rescue JWT::DecodeError
            raise UnauthorizedAccessException.new(message="Invalid credentials", status=403)
        end
    end

    def encode_token(payload)
        custom_header = {
        'alg': 'HS512',
        'typ': 'JWT',
        'exp': Time.now.to_i + 3600  # Expiry time in seconds (e.g., 1 hour from now)
        }
      
        # Encode the payload using the secret key and return the token
        JWT.encode(payload, secret_key, 'HS512', custom_header)
    end

    # def save_binary_data_to_active_storage(model_field_instance, data_url, file_name)
    #     # Separate base64 string from metadata
    #     data = data_url.split(',')
    #     base64String = data[-1]
    #     content_type = data[0].slice((data[0].index(":")+1)...data[0].index(";")) # Content-Type
    #     extension = data[0].slice((data[0].index("/")+1)...data[0].index(";")) # File extension

    #     # Extracting the base64 String
    #     binary_data = Base64.decode64(base64String)

    #     model_field_instance.attach(io: StringIO.new(binary_data), filename: "#{file_name}.#{extension}", content_type: content_type)
    # end

    private

    def secret_key
        # Obtain the secret key from the key base
        Rails.application.credentials.secret_key_base
    end

    def record_not_found_response
        render json: { error: "#{controller_name.classify} not found", status: "RESOURCE NOT FOUND" }, status: :not_found
    end

    def resource_not_found_response(exception)
        render json: { status: "RESOURCE NOT FOUND", error: exception.message }, status: :not_found
    end

    def unprocessable_entity_response(invalid)
        render json: { errors: invalid.record.errors, status: "UNPROCESSABLE ENTITY" }, status: :unprocessable_entity
    end

    def forbidden_access_response(exception)
        render json: { status: "FORBIDDEN ACCESS", error: exception.message }, status: :forbidden
    end

    def session_expired_response(exception)
        render json: { status: 'SESSION EXPIRED', error: exception.message }, status: :unauthorized
    end

    def unauthorized_access_response(exception)
        render json: { status: "UNAUTHOURIZED ACCESS", code: exception.status, error: exception.message }, status: exception.status
    end

    def policy_violation_response(exception)
        if exception.record.class.ancestors.include?(ApplicationRecord)
            error = "You are #{exception.message} (#{exception.record&.id})"
        else
            error = "You are not authorized to perform this action."
        end
        render json: { "status": "POLICY VIOLATION", error: error }, status: 403
    end

    def custom_exception_response(exception)
        render json: { error: exception.message, status: exception.status }, status: exception.code
    end

    def query_params
        params.permit(:q, :v, :page_number, :page_population)
    end

    def pagination_params
        {
            page_number: parse_integer_param(params[:page_number], 1, ->(x) { x > 0 }),
            page_population: parse_integer_param(params[:page_population] , 1, ->(x) { x > 0 })
        }
    end

    def parse_integer_param(v, default = 0, predicate = ->(x) { true })
        return default unless v
        begin
            new_value = v.to_i
            return default unless predicate.call(new_value)
            new_value
        rescue StandardError => e
            default
        end
    end
end
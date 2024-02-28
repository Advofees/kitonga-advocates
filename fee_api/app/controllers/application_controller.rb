require 'base64'

class ApplicationController < ActionController::API

    include Pundit::Authorization

    wrap_parameters format: []
    # include ActionController::Cookies
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found_response
    rescue_from ResourceNotFoundException, with: :resource_not_found_response
    rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity_response
    rescue_from Mongoid::Errors::Validations, with: :unprocessable_mongoid_entity_response
    rescue_from ForbiddenAccessException, with: :forbidden_access_response
    rescue_from SessionExpiredException, with: :session_expired_response
    rescue_from UnauthorizedAccessException, with: :unauthorized_access_response
    rescue_from CustomException, with: :custom_exception_response
    rescue_from Pundit::NotAuthorizedError, with: :policy_violation_response

    rescue_from Mongoid::Errors::DocumentNotFound, with: :document_not_found_response

    before_action :authenticate
    skip_before_action :authenticate, only: [:welcome]

    def welcome
        render json: { "Advokit" => "Advocacy and Case Management Suite" }
    end

    def pundit_user
        @auth_context
    end

    def authenticate
        # Decode and verify JWT token from the 'jwt' cookie
        # token = cookies.signed[:user]

        authorization_header = request.headers['Authorization']

        if authorization_header.present? && authorization_header.start_with?('Bearer') && authorization_header.split(/\s+/).size === 2
            begin
                secret_key = Rails.application.secrets.secret_key_base

                # Obtain the token
                token = authorization_header.split(/\s+/)[1]

                # Decode token
                decoded_token = JWT.decode(token, secret_key, true, { algorithm: 'HS512' })

                # token_header
                token_header = decoded_token[1]

                unless (token_header.present? && token_header["exp"].present? && token_header["exp"] >= Time.now.to_i)
                    raise SessionExpiredException, 'Your session has expired. Please log in again.'
                end
    
                payload = decoded_token.first

                if payload['grant_type'] == 'user'
                    user = User.find(payload['id'])
                    unless !user
                        @auth_context = AuthContext.new((user.as_json only: [:username, :id, :name, :email ]), "user", [ user.roles.map(&:name), user.groups.map { |grp| grp.roles.map(&:name) } ].flatten.uniq)
                    end
                elsif payload['grant_type'] == 'client'
                    client = Client.find(payload['id'])
                    unless !client
                        @auth_context = AuthContext.new((client.as_json only: [:username, :id, :name, :email ]), "client", [ client.roles.map(&:name), client.groups.map { |grp| grp.roles.map(&:name) } ].flatten.uniq)
                    end
                end
            rescue JWT::DecodeError => e
                # Invalid JWT token
                raise UnauthorizedAccessException, "Invalid access token"
            end
        end

        # If no valid JWT token found, denie access
        unless @auth_context
            raise UnauthorizedAccessException
        end
    end

    def encode_token(payload)
        # Set the secret key used for signing the token
        secret_key = Rails.application.secrets.secret_key_base

        custom_header = {
        'alg': 'HS512',
        'typ': 'JWT',
        'exp': Time.now.to_i + 3600  # Expiry time in seconds (e.g., 1 hour from now)
        }
      
        # Encode the payload using the secret key and return the token
        JWT.encode(payload, secret_key, 'HS512', custom_header)
    end

    def save_binary_data_to_active_storage(model_field_instance, data_url, file_name)
        # Separate base64 string from metadata
        data = data_url.split(',')
        base64String = data[-1]
        content_type = data[0].slice((data[0].index(":")+1)...data[0].index(";")) # Content-Type
        extension = data[0].slice((data[0].index("/")+1)...data[0].index(";")) # File extension

        # Extracting the base64 String
        binary_data = Base64.decode64(base64String)

        model_field_instance.attach(io: StringIO.new(binary_data), filename: "#{file_name}.#{extension}", content_type: content_type)
    end

    private

    def record_not_found_response
        render json: { error: "#{controller_name.classify} not found", message: "RESOURCE NOT FOUND" }, status: :not_found
    end

    def document_not_found_response(exception)
        render json: { error: "Document not found"}, status: :not_found
    end

    def resource_not_found_response(exception)
        render json: { message: exception.message }, status: :not_found
    end

    def unprocessable_entity_response(invalid)
        render json: { errors: invalid.record.errors, message: "UNPROCESSABLE ENTITY" }, status: :unprocessable_entity
    end

    def unprocessable_mongoid_entity_response(invalid)
        render json: { errors: invalid.record.errors, message: "UNPROCESSABLE ENTITY" }, status: :unprocessable_entity
    end

    def forbidden_access_response(exception)
        render json: { message: "FORBIDDEN ACCESS", error: exception.message }, status: :forbidden
    end

    def session_expired_response(exception)
        render json: { message: 'SESSION EXPIRED', error: exception.message }, status: :unauthorized
    end

    def unauthorized_access_response(exception)
        render json: { status: exception.status, error: exception.message }, status: exception.status
    end

    def policy_violation_response(exception)
        render json: { error: "You are #{exception.message} (#{exception.record&.id})" }, status: 403
    end

    def custom_exception_response(exception)
        render json: { error: exception.message }, status: exception.code
    end
end